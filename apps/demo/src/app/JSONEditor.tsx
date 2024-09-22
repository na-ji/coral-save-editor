import { createJSONEditor, JSONEditorPropsOptional } from 'vanilla-jsoneditor';
import { useEffect, useRef, FC } from 'react';
// import './VanillaJSONEditor.css';

export const SvelteJSONEditor: FC<JSONEditorPropsOptional> = (props) => {
  const refContainer = useRef<HTMLDivElement>(null);
  const refEditor = useRef<ReturnType<typeof createJSONEditor>>(null);

  useEffect(() => {
    if (!refContainer.current) {
      return;
    }
    // create editor
    console.log('create editor', refContainer.current);
    refEditor.current = createJSONEditor({
      target: refContainer.current,
      props: {},
    });

    return () => {
      // destroy editor
      if (refEditor.current) {
        console.log('destroy editor');
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  // update props
  useEffect(() => {
    if (refEditor.current) {
      console.log('update props', props);
      refEditor.current.updateProps(props);
    }
  }, [props]);

  return <div className="vanilla-jsoneditor-react" ref={refContainer} />;
};
