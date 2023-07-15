<template>
    <transition name="modal-animation">
        <div v-show="modalActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalActive" class="modal-inner">
                    <div class="modal-inner-fmt">
                        <!-- <img @click="close" src="@/assets/close-circle-line.png" alt="close" /> -->
                        <div class="modalHeader">
                            <div class="modalHeaderInner">
                                <slot name="header">
                                    <!-- modal content -->
                                </slot>
                            </div>
                            <!-- <h3>Specify Document Label &amp; Location</h3> -->
                            <svg @click="close" class="remix">
                                <use :xlink:href="`${remixiconUrl}#ri-close-circle-line`"></use>
                            </svg>
                        </div>
                        <slot name="list">
                            <!-- modal content -->
                        </slot>
                        <slot>
                            <!-- modal content -->
                        </slot>
                        <slot name="footer">
                            <!-- modal content -->
                        </slot>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
// modal (10/31/2021) based on https://github.com/johnkomarnicki/vue-3-modal
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'

export default {
    props: ["modalActive","oItem"],
    setup(props, {emit}) {
        const close = () => {
            emit("close")
        }
        const setDoc = () => {
            emit("setDoc")
        }
        return { close, setDoc }
    },
    data() {
        return {
            remixiconUrl,
        }
  }, 
}

</script>

<style lang="scss" scoped>
.modal-animation-enter-active,
.modal-animation-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-animation-enter-from,
.modal-animation-leave-to {
  opacity: 0;
}
.modal-animation-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}
.modal-animation-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-animation-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.modal-animation-inner-leave-to {
  transform: scale(0.8);
}
.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 99999;

    .modal-inner {
        position: relative;
        max-width: 400px;
        width: 80%;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background-color: rgb(145, 143, 143);
        padding: 16px;
        .remix {
            // position: absolute;
            top: 15px;
            right: 15px;
            cursor: pointer;
        }
        svg{
            width: 1.5em;
            height: 1.5em;
            fill: black;
        }
        svg:hover{
            fill:red;
        }
        .modalActionButtons {
            position: absolute;
            bottom: 15px;
            right: 0px;
            width:200px;
        }
        button {
            width:70px;
            margin: 3px 10px 3px 15px;
            padding: 3px 5px 3px 3px;
        }
        .modalHeaderInner{
            display:flex;
            flex-direction: column;
        }
    }

}
</style>