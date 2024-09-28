import Quill from 'quill'
import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react'

// Editor is an uncontrolled React component
const EditorV2 = forwardRef(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef(null)
    const defaultValueRef = useRef(defaultValue)
    const onTextChangeRef = useRef(onTextChange)
    const onSelectionChangeRef = useRef(onSelectionChange)

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange
      onSelectionChangeRef.current = onSelectionChange
    })

    useEffect(() => {
      ref.current?.enable(!readOnly)
    }, [ref, readOnly])

    useEffect(() => {
      const toolbarOptions = ['image']

      const container = containerRef.current
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div')
      )
      const quill = new Quill(editorContainer, {
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              //image: imageHandler
            },
          },
        },
        theme: 'snow',
      })

      ref.current = quill

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current)
      }

      quill.on(Quill.events.TEXT_CHANGE, () => {
        // No-op
      })

      quill.on(Quill.events.SELECTION_CHANGE, () => {
        // No-op
      })

      return () => {
        ref.current = null
        container.innerHTML = ''
      }
    }, [ref])

    return <div ref={containerRef}></div>
  }
)

EditorV2.displayName = 'EditorV2'

export default EditorV2
