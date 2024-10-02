mod utils;

use std::cmp::min;
use wasm_bindgen::prelude::*;

use std::io::{Read};
use flate2::read::ZlibDecoder;
use uesave::{ByteArray, PropertyInner, Save, StructType, Types, ValueArray, ValueVec};
use std::io::Cursor;
use web_sys::console;
use crate::utils::set_panic_hook;
use js_sys::{ArrayBuffer, Uint8Array};
use gloo_utils::format::JsValueSerdeExt;

const ZLIB_HEADER: [u8; 2] = [0x78, 0x9c];

#[wasm_bindgen]
extern "C" {
}

fn find_zlib_offsets(bytes: &[u8]) -> Vec<usize> {
    let mut offsets = Vec::new();
    let mut index = 0;

    while index < bytes.len() {
        if let Some(offset) = bytes[index..].windows(ZLIB_HEADER.len()).position(|window| window == ZLIB_HEADER) {
            let end = min(index + offset + 33 * 1024, bytes.len());
            match ZlibDecoder::new(&bytes[index + offset..end]).read_exact(&mut [0u8]) {
                Ok(_) => {
                    offsets.push(index + offset);
                    index += offset + ZLIB_HEADER.len();
                },
                Err(_) => {
                    index += offset + ZLIB_HEADER.len();
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
        let chunk = &compressed_bytes[offsets[index]..if index < offsets.len() - 1 {
            offsets[index + 1]
        } else {
            compressed_bytes.len()
        }];

        let mut decoder = ZlibDecoder::new(chunk);
        let mut bytes = Vec::new();
        decoder.read_to_end(&mut bytes).expect("Unable to decompress data");
        decompressed.extend(bytes);
    }
    console::time_end_with_label("Decompressing inner save");

    decompressed
}

fn get_types() -> Types {
    let mut types = Types::new();

    types.add(String::from(".SaveData.timeLocationMapTracker.Key"), StructType::DateTime);
    types.add(String::from(".SaveData.timeLocationMapTracker.Value"), StructType::Vector);
    types.add(String::from(".SaveData.interiorSaveDataMap.Value"), StructType::Struct(Some(String::from("Map"))));
    types.add(String::from(".SaveData.interiorSaveDataMap.tileEntryMap.Key"), StructType::Struct(None));
    types.add(String::from(".SaveData.interiorSaveDataMap.tileEntryMap.Value"), StructType::Struct(Some(String::from("Map"))));
    types.add(String::from(".SaveData.interiorSaveDataMap.tileEntryMap.wallObjects.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.furnitureSaveDataMap.Value"), StructType::Struct(Some(String::from("Map"))));
    types.add(String::from(".SaveData.furnitureSaveDataMap.savedEntryMap.Value"), StructType::Struct(Some(String::from("Map"))));
    types.add(String::from(".SaveData.furnitureSaveDataMap.savedEntryMap.entryArray.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.NPCSaveData.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.NPCSaveData.triggeredDynamicDialog.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.npcWorldSpeechCooldownMap.Value"), StructType::Struct(Some(String::from("Map"))));
    types.add(String::from(".SaveData.npcWorldSpeechCooldownMap.waypointTriggerMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.shopStocks.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.shopStocks.stockItems.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.shopStocks.limitedItemStock.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.dayEndEventCooldownMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.unlockedTornPages.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.mailRuntimeTags.Value"), StructType::GameplayTagContainer);
    types.add(String::from(".SaveData.questRuntimeTags.Value"), StructType::GameplayTagContainer);
    types.add(String::from(".SaveData.mineProgressionMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.labUpgradeData.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.donatedItemInfo"), StructType::Struct(Some(String::from("Set"))));
    types.add(String::from(".SaveData.dynamicQuestDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.enchantmentSaveData.enchantmentSaveDataMap.Value"), StructType::Struct(Some(String::from("Map"))));
    types.add(String::from(".SaveData.offeringGroupsMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.offeringGroupsMap.offeringsMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.divingOfferingMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.procToGrowSaves.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.divingLevelData.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.divingLevelData.clusterData.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.caughtFish.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.lastGiftFromNPCDate.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.minigameClaimedReward.claimedRewardWinPosition.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.itemStorageDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.gridObjectsDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.farmHouseMaterials.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.ranchBuildingData.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.ranchBuildingData.animalsData.logAnimalMoods.Key"), StructType::Struct(None));
    types.add(String::from(".SaveData.ranchBuildingData.animalsData.logAnimalMoods.Value"), StructType::Struct(Some(String::from("Set"))));
    types.add(String::from(".SaveData.ranchBuildingData.autoCollectorData.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.ranchBuildingData.interiorSaveData.tileEntryMap.Key"), StructType::Struct(None));
    types.add(String::from(".SaveData.ranchBuildingData.interiorSaveData.tileEntryMap.Value"), StructType::Struct(Some(String::from("Map"))));
    types.add(String::from(".SaveData.ranchBuildingData.interiorSaveData.tileEntryMap.wallObjects.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.ranchBuildingData.placedData.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.ranchBuildingData.placedData.savedEntryMap.entryArray.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.gachaMachineData.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.tileSaveDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.tileSaveDataMap.savedEntryMap.Key"), StructType::Struct(None));
    types.add(String::from(".SaveData.tileSaveDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.farmTileSaveDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.farmTileSaveDataMap.savedEntryMap.Key"), StructType::Struct(None));
    types.add(String::from(".SaveData.farmTileSaveDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.players.playerStatistics.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.players.playerMasteryLevel.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.players.caughtBug.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.players.journalData.fishingCaughtables.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.players.journalData.catchingCaughtables.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.players.weekNpcHangoutData.Value"), StructType::Struct(Some(String::from("int32"))));
    types.add(String::from(".SaveData.cropSaveDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.cropSaveDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.cropSaveDataMap.savedEntryMap.entryArray.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.debrisSaveDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.debrisSaveDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.debrisSaveDataMap.savedEntryMap.entryArray.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.farmBuildingSaveDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.farmBuildingSaveDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.farmBuildingSaveDataMap.savedEntryMap.entryArray.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.fruitPlantSaveDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.fruitPlantSaveDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.fruitPlantSaveDataMap.savedEntryMap.entryArray.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.fruitTreeSaveDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.fruitTreeSaveDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.fruitTreeSaveDataMap.savedEntryMap.entryArray.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.grassSaveDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.grassSaveDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.grassSaveDataMap.savedEntryMap.entryArray.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.grassSaveDataMap.savedEntryMap.entryArray.tuftInQuadrantMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.groundSaveDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.groundSaveDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.groundSaveDataMap.savedEntryMap.entryArray.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.lootSaveDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.lootSaveDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.lootSaveDataMap.savedEntryMap.entryArray.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.placedSaveDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.placedSaveDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.placedSaveDataMap.savedEntryMap.entryArray.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.fenceSaveDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.fenceSaveDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.gateSaveDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.gateSaveDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.floorSaveDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.floorSaveDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.treeSaveDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.treeSaveDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.treeSaveDataMap.savedEntryMap.entryArray.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.disturbedSoilDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.disturbedSoilDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.disturbedSoilDataMap.savedEntryMap.entryArray.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.giantCropDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.giantCropDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.fertilizerDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.fertilizerDataMap.savedEntryMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.fertilizerDataMap.savedEntryMap.entryArray.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.excavationSoilDataMap.Value"), StructType::Struct(None));
    types.add(String::from(".SaveData.excavationSoilDataMap.savedEntryMap.Value"), StructType::Struct(None));

    types
}

#[wasm_bindgen]
pub fn read_outer_save(buffer: ArrayBuffer) -> Result<JsValue, String> {
    set_panic_hook();
    console::time_with_label("Decoding outer save");
    let outer_save_content: Vec<u8> = Uint8Array::new_with_byte_offset_and_length(
        &buffer,
        0,
        buffer.byte_length(),
    ).to_vec();

    let mut outer_save_buffer = Cursor::new(outer_save_content);
    match Save::read(&mut outer_save_buffer) {
        Ok(mut outer_save) => {
          console::time_end_with_label("Decoding outer save");

            let bytes_result = match &mut outer_save.root.properties["compressedSaveData"].inner {
                PropertyInner::Array { value: property_value, .. } => {
                    match property_value {
                        ValueArray::Base(vec) => {
                            match vec {
                                ValueVec::Byte(v) => match v {
                                    ByteArray::Byte(b) => {
                                        Ok(b)
                                    }
                                    _ => {
                                        Err("Invalid save data")
                                    }
                                },
                                _ => {
                                    Err("Invalid save data")}
                            }
                        }
                        _ => {
                            Err("Invalid save data")}
                    }
                }
                _ => {
                    Err("Invalid save data")
                }
            };
            if bytes_result.is_err() {
                return Err(bytes_result.expect_err("").parse().unwrap());
            }
            let compressed_bytes = bytes_result?;

            let decompressed_bytes = decompress_save_data(compressed_bytes);
            let mut inner_save_buffer = Cursor::new(decompressed_bytes);
            console::time_with_label("Decoding inner save");
            let types = get_types();
            let json_save = match Save::read_with_types(&mut inner_save_buffer, &types) {
                Ok(inner_save) => {
                    console::time_end_with_label("Decoding inner save");
                    console::time_with_label("Serializing to json");
                    Ok(JsValue::from_serde(&inner_save).unwrap())
                }
                Err(error) => Err(error.to_string())
            };
            console::time_end_with_label("Serializing to json");

            json_save
        }
        Err(error) => Err(error.to_string())
    }
}
