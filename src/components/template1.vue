<template>
  <!-- introduction heading template -->
  <div class="item">
    <div class="itemRow">
      <div class="itemTitle">
        <input class="itemNo" v-if="!isPrint" v-model="modelValue.itemIndex" />
        <div class="itemNo" v-if="isPrint">{{ modelValue.itemIndex }}</div>
        <input id="itemTitleText" v-if="!isPrint" class="itemTitleText" type="text" maxlength="80" v-model="modelValue.title" placeholder="title of item" />
        <div class="itemTitleText" v-if="isPrint">{{ modelValue.title }}</div>
      </div>
      <div v-if="showDelBtn" class="itemTimeDiv">
          <button class="btnDelItem" @click="deleteMe(modelValue.guid)">
              <img src="../assets/delete-bin-2-line.svg" alt="X" title="Delete this Item" />
          </button>
      </div>
    </div>
    <div class="content">
      <!-- <p class="content" v-html="modelValue.itemData.paragraph"></p> -->
      <!-- <div v-html="require('!raw-loader!@/assets/doneHeader.html').default"></div> -->
      <!-- <div v-html="doneHeader"></div> -->
      <doneHeader></doneHeader>
    </div>
  </div>
</template>

<script>
import { inject, computed } from "vue";
//import doneHeader from '!raw-loader!@/assets/doneHeader.html'
import doneHeader from "./doneHeader"

export default {
  name: "template1",
  components:{
    doneHeader,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const oItem = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });
    const store = inject("store");

    // return { store, oItem, doneHeader };
       return { store, oItem };
  },
  mounted() {
    // console.log(this.oData)
  },
  data() {
    let oAgenda = this.store.state.oData.agenda;
    let oMembers = this.store.state.oData.members;
    let oTemplates = this.store.state.oData.templates;
    let showDelBtn = this.store.state.showDelBtn
    let showTimerBtn = this.store.state.showTimerBtn
    let isPrint = this.store.state.isPrint

    return {
      oAgenda,
      oMembers,
      oTemplates,
      showDelBtn,
      showTimerBtn,
      isPrint
    };
  },
  methods: {
    testMe: function () {
      console.log(this.oData);
    },

    deleteMe(lcGUID) {
      console.log(lcGUID);
      // search the agenda stack for item to be deleted
      for (var i = 0; i < this.oAgenda.agendaItems.length; i++) {
        if (this.oAgenda.agendaItems[i].guid === lcGUID) {
          // item found by GUID
          console.log(this.store.addItemRefs);
          // search navMenu, addItem dropdown options for item format
          for (var j = 0; j < this.store.addItemRefs.length; j++) {
            console.log(
              this.store.addItemRefs[j].innerHTML +
                "  '" +
                this.store.addItemRefs[j].value +
                "' 'J:'" +
                j
            );
            if (
              this.store.addItemRefs[j].value ==
              this.oAgenda.agendaItems[i].itemFmt
            ) {
              // item format option found, insure item can be readded
              this.store.addItemRefs[j].disabled = false;
              // force "please select one" option to release disabled add button
              this.store.addItemRefs[
                this.store.addItemRefs.length - 1
              ].selected = true;
            }
          }
          // delete this agenda item
          console.log(this.oAgenda.agendaItems[i]);
          var oDeleted = this.oAgenda.agendaItems.splice(i, 1);
          console.log("delete item completed");
        }
      }
    },
  },
};
</script>
<style>
.hideMe {
  display: none;
}
.doneHeader{
  margin:0 25px 0 25px;
}
.doneHeader p{
  margin:10px 0 10px 0;
}
.doneHeader ol{
  margin-left: 25px;
  list-style: disc;
}
</style>
