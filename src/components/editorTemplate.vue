<template>
    <div v-if="editor">
        <div class="editMenu" ref="editMenu">
            <menu-bar class="editor__header" :editor="editor"  />
        </div>
        <editor-content :editor="editor" />
    </div>
</template>

<script>
import {inject, computed, ref} from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import MenuBar from '@/components/menuBar.vue'

export default {
    name:'editorTemplate',
    components: {
        EditorContent,
        MenuBar,
    },
    props: {
        modelValue: {
            type: [Object,String],
            default: () => ({}),
        },
    },
    emits: ['update:modelValue'],

    data(){
        let editor = null
        let isEditorFocus = false
        return {
            editor, isEditorFocus
        }
    },
    watch: {
        modelValue(value) {
        const isSame = this.editor.getHTML() === value

        if (isSame) {
            return
        }

        this.editor.commands.setContent(value, false)
        },
    },
    mounted(){
        
        this.editor = new Editor( {
            extensions: [ 
                Placeholder,
                StarterKit.configure({
                    history: true,
                }),
                Highlight,
            ],
            content: this.modelValue.content,
            onUpdate: () => {

                this.modelValue.content=this.editor.getHTML()

            },
            onFocus: () => {
                //console.log('focus fired')
                this.$refs.editMenu.style.display="flex"
            },
            onBlur:(fired) => {
                if(!this.isRealValue(fired.event.relatedTarget)){
                this.$refs.editMenu.style.display="none"
                }else{
                //console.log(fired.event.relatedTarget.className)
                if(fired.event.relatedTarget.className.includes('menu-item') == false){
                    this.$refs.editMenu.style.display="none"
                }
                }
                //console.log('blur fired')
            }

        })
        // init editMenu in css styles,css setting
        // this.$refs.editMenu.style.display="none"

    },
    beforeUnmount() {
        this.editor.destroy()
    },
    methods:{
        isRealValue(obj)
        {
        return obj && obj !== 'null' && obj !== 'undefined';
        },
        myScope(){
            this.$refs.editMenu.style.display="none"
            console.log('myScope')
        },
        editorFocus(){
            this.$refs.editMenu.style.display="none"
        },
    }
}
</script>

<style lang="scss">
.editor {
  display: flex;
  flex-direction: column;
  max-height: 26rem;
  color: #0D0D0D;
  background-color: #FFF;
  border: 3px solid #0D0D0D;
  border-radius: 0.75rem;

  &__header {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    flex-wrap: wrap;
    padding: 0.25rem;
    border-bottom: 3px solid #0D0D0D;
  }

  &__content {
    padding: 1.25rem 1rem;
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  &__footer {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    white-space: nowrap;
    border-top: 3px solid #0D0D0D;
    font-size: 12px;
    font-weight: 600;
    color: #0D0D0D;
    white-space: nowrap;
    padding: 0.25rem 0.75rem;
  }

  /* Some information about the status */
  &__status {
    display: flex;
    align-items: center;
    border-radius: 5px;

    &::before {
      content: ' ';
      flex: 0 0 auto;
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      background: rgba(#0D0D0D, 0.5);
      border-radius: 50%;
      margin-right: 0.5rem;
    }

    &--connecting::before {
      background: #616161;
    }

    &--connected::before {
      background: #B9F18D;
    }
  }

  &__name {
    button {
      background: none;
      border: none;
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      color: #0D0D0D;
      border-radius: 0.4rem;
      padding: 0.25rem 0.5rem;

      &:hover {
        color: #FFF;
        background-color: #0D0D0D;
      }
    }
  }
}
</style>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }
  background-color: #FFF;

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
  p{
    padding:0;
  }
}
</style>

