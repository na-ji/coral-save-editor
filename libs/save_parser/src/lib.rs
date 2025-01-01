mod types;
mod utils;

use std::cmp::min;
use wasm_bindgen::prelude::*;

use crate::utils::set_panic_hook;
use byteorder::{LittleEndian, WriteBytesExt};
use flate2::read::ZlibDecoder;
use flate2::write::ZlibEncoder;
use flate2::Compression;
use gloo_utils::format::JsValueSerdeExt;
use js_sys::{ArrayBuffer, Uint8Array};
use std::io::Read;
use std::io::{Cursor, Write};
use uesave::{ByteArray, PropertyInner, PropertyType, Save, ValueArray, ValueVec};
use web_sys::console;

const MAGIC_HEADER: [u8; 4] = [0xc1, 0x83, 0x2a, 0x9e];
const HEADER_SIZE: usize = 48;
const CHUNK_SIZE: usize = 0x20000;
const CHUNK_SIZE_IN_BYTES: [u8; 4] = [0x00, 0x00, 0x02, 0x00];
const NULL_HEADER: [u8; 4] = [0x00, 0x00, 0x00, 0x00];

const VERSION: &str = env!("CARGO_PKG_VERSION");

#[wasm_bindgen]
extern "C" {}

fn find_zlib_offsets(bytes: &[u8]) -> Vec<usize> {
    let mut offsets = Vec::new();
    let mut index = 0;

    while index < bytes.len() {
        if let Some(offset) = bytes[index..]
            .windows(MAGIC_HEADER.len())
            .position(|window| window == MAGIC_HEADER)
        {
            let end = min(index + offset + HEADER_SIZE + 33 * 1024, bytes.len());

            match ZlibDecoder::new(&bytes[index + offset + HEADER_SIZE..end]).read_exact(&mut [0u8])
            {
                Ok(_) => {
                    offsets.push(index + offset);
                    index += offset + HEADER_SIZE;
                }
                Err(_) => {
                    index += offset + HEADER_SIZE;
                    continue;
                }
            }
        } else {
            break;
        }
    }

    offsets
}

fn decompress_save_data(compressed_bytes: &mut Vec<u8>) -> Vec<u8> {
    console::time_with_label("Decompressing inner save");
    let offsets = find_zlib_offsets(&compressed_bytes);

    let mut decompressed = Vec::new();

    for index in 0..offsets.len() {
        let chunk = &compressed_bytes[offsets[index] + HEADER_SIZE..if index < offsets.len() - 1 {
            offsets[index + 1]
        } else {
            compressed_bytes.len()
        }];

        let mut decoder = ZlibDecoder::new(chunk);
        let mut bytes = Vec::new();
        decoder
            .read_to_end(&mut bytes)
            .expect("Unable to decompress data");
        decompressed.extend(bytes);
    }
    console::time_end_with_label("Decompressing inner save");

    decompressed
}

fn read_compressed_save_data(outer_save: &mut Save) -> Result<&mut Vec<u8>, &str> {
    let bytes_result = match &mut outer_save.root.properties["compressedSaveData"].inner {
        PropertyInner::Array {
            value: property_value,
            ..
        } => match property_value {
            ValueArray::Base(vec) => match vec {
                ValueVec::Byte(v) => match v {
                    ByteArray::Byte(b) => Ok(b),
                    _ => Err("Invalid save data"),
                },
                _ => Err("Invalid save data"),
            },
            _ => Err("Invalid save data"),
        },
        _ => Err("Invalid save data"),
    };
    bytes_result
}

#[wasm_bindgen]
pub fn decode_save(raw_save: ArrayBuffer) -> Result<JsValue, String> {
    set_panic_hook();
    console::log_2(&"save_parser ".into(), &String::from(VERSION).into());
    console::time_with_label("Decoding outer save");
    let outer_save_content: Vec<u8> =
        Uint8Array::new_with_byte_offset_and_length(&raw_save, 0, raw_save.byte_length()).to_vec();

    let mut outer_save_buffer = Cursor::new(outer_save_content);
    match Save::read(&mut outer_save_buffer) {
        Ok(mut outer_save) => {
            console::time_end_with_label("Decoding outer save");

            let save_version: Result<&mut i32, &str> = match &mut outer_save.root.properties["Version"].inner {
              PropertyInner::Int(save_version) => Ok(save_version),
              _ => Err("Invalid save version")
            };
            if save_version.is_err() {
              return Err(save_version.expect_err("").parse().unwrap());
            }
            console::log_2(&"Save version ".into(), &save_version?.to_string().into());

            let bytes_result = read_compressed_save_data(&mut outer_save);
            if bytes_result.is_err() {
                return Err(bytes_result.expect_err("").parse().unwrap());
            }
            let compressed_bytes = bytes_result?;

            let decompressed_bytes = &decompress_save_data(compressed_bytes)[4..];
            let mut inner_save_buffer = Cursor::new(decompressed_bytes);
            console::time_with_label("Decoding inner save");
            let types = types::get_types();
            let json_save = match Save::read_with_types(&mut inner_save_buffer, &types) {
                Ok(inner_save) => {
                    console::time_end_with_label("Decoding inner save");
                    console::time_with_label("Serializing to json");
                    Ok(JsValue::from_serde(&inner_save).unwrap())
                }
                Err(error) => Err(error.to_string()),
            };
            console::time_end_with_label("Serializing to json");

            json_save
        }
        Err(error) => Err(error.to_string()),
    }
}

pub fn compress_save(save: &Vec<u8>) -> Vec<u8> {
    let mut compressed_save: Vec<u8> = Vec::new();
    let mut index: usize = 0;

    while index < save.len() {
        let end = min(index + CHUNK_SIZE, save.len());
        let chunk = &save[index..end];
        let chunk_size = end - index;
        let mut chunk_size_in_bytes: Vec<u8> = vec![];
        chunk_size_in_bytes
            .write_u32::<LittleEndian>(chunk_size as u32)
            .unwrap();

        let mut encoder = ZlibEncoder::new(vec![], Compression::default());
        encoder.write_all(chunk).expect("Unable to compress data");
        let compressed_chunk = encoder.finish().expect("Unable to finalize compression");
        let mut compressed_chunk_size: Vec<u8> = vec![];
        compressed_chunk_size
            .write_u32::<LittleEndian>(compressed_chunk.len() as u32)
            .unwrap();

        compressed_save.extend(MAGIC_HEADER);
        compressed_save.extend(NULL_HEADER);
        compressed_save.extend(CHUNK_SIZE_IN_BYTES);
        compressed_save.extend(NULL_HEADER);

        compressed_save.extend(compressed_chunk_size.clone());
        compressed_save.extend(NULL_HEADER);
        compressed_save.extend(chunk_size_in_bytes.clone());
        compressed_save.extend(NULL_HEADER);

        compressed_save.extend(compressed_chunk_size);
        compressed_save.extend(NULL_HEADER);
        compressed_save.extend(chunk_size_in_bytes);
        compressed_save.extend(NULL_HEADER);

        compressed_save.extend(compressed_chunk);

        index = index + CHUNK_SIZE;
    }

    compressed_save
}

#[wasm_bindgen]
pub fn encode_save(raw_save: ArrayBuffer, new_inner_save: JsValue) -> Result<Vec<u8>, String> {
    set_panic_hook();
    console::log_2(&"save_parser ".into(), &String::from(VERSION).into());

    console::time_with_label("Encoding inner save");
    let inner_save: Save = new_inner_save.into_serde().unwrap();
    let mut inner_save_buffer = Cursor::new(vec![]);
    inner_save
        .write(&mut inner_save_buffer)
        .expect("Failed to encode inner save");
    let mut inner_save_bytes = inner_save_buffer.into_inner();
    console::time_end_with_label("Encoding inner save");

    let inner_save_size_le: [u8; 4] = u32::to_le_bytes((inner_save_bytes.len() - 4) as u32);
    inner_save_bytes.splice(0..0, inner_save_size_le.iter().cloned());

    console::time_with_label("Compressing inner save");
    let compressed_inner_save = compress_save(&inner_save_bytes);
    console::time_end_with_label("Compressing inner save");

    console::time_with_label("Decoding outer save");
    let outer_save_content: Vec<u8> =
        Uint8Array::new_with_byte_offset_and_length(&raw_save, 0, raw_save.byte_length()).to_vec();
    let mut outer_save_input = Cursor::new(outer_save_content);
    let mut outer_save_output = Cursor::new(vec![]);

    match Save::read(&mut outer_save_input) {
        Ok(mut outer_save) => {
            console::time_end_with_label("Decoding outer save");

            console::time_with_label("Encoding outer save");
            outer_save.root.properties["compressedSaveData"].inner = PropertyInner::Array {
                array_type: PropertyType::ByteProperty,
                value: ValueArray::Base(ValueVec::Byte(ByteArray::Byte(compressed_inner_save))),
            };

            outer_save
                .write(&mut outer_save_output)
                .expect("Failed to encode outer save");
            let final_save = outer_save_output.into_inner();
            console::time_end_with_label("Encoding outer save");

            Ok(final_save)
        }
        Err(error) => Err(error.to_string()),
    }
}
