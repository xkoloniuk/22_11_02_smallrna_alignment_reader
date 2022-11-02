<template>
  <table>
    <thead>
      <tr>
        <th v-show="showRemoveOption">Remove</th>
        <th>File name</th>
        <th>Run date</th>
        <th>Samples, n</th>
        <th>Sample types</th>
        <th>Targets</th>
      </tr>
    </thead>

    <tr
      class="run-item"
      v-for="(file, index) in files"
      :key="file['Run Started']"
    >
      <td v-show="showRemoveOption">
        <img
          class="exclude-btn"
          src="../assets/btn-close.svg"
          @click="onExcludeClick(index)"
        />
      </td>
      <td class="run-title">
        <span>{{ index + 1 + ". " + file["File Name"] }}</span>
      </td>
      <td class="run-title">
        {{ file["Run Started"] }}
      </td>
      <td class="run-title">
        {{ file.data.length }}
      </td>
      <td class="run-title">
        {{ arrToString(file.sampleTypes) }}
      </td>
      <td>
        <i-targets-boxes :targets="file.targets" />
      </td>
    </tr>
  </table>
</template>

<script>
import store from "@/store/index";
import router from "@/router";
import ITargetsBoxes from "@/components/ITargetsBoxes.vue";

export default {
  name: "IListItem",
  props: {
    files: Array,
    showRemoveOption: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ITargetsBoxes,
  },
  methods: {
    arrToString(arr) {
      if (arr.length > 10) {
        const shortenArr = ["and others..."];
        shortenArr.push(...arr.splice(0, 9));
        return shortenArr.join(", ");
      } else {
        return arr.join(", ");
      }
    },
    onExcludeClick(index) {
      store.commit("removeEntry", index);
    },
    openRunView (e){
      const run = e.target.innerText
      router.push(`/RunView/${run}`)

    }
  },
};
</script>

<style lang="stylus" scoped>

table
  // border-spacing 100px
  border-collapse collapse
  table-layout fixed
  width: 100%
th, td
  text-align: left
th:nth-child(2)
  font-weight bold
  font-size 1.2rem
  padding 0.75rem 1rem
th:nth-child(1),td:nth-child(1)
  width 5%
th:nth-child(2),td:nth-child(2)
  width 20%
th:nth-child(n+3):nth-child(-n+5),td:nth-child(n+3):nth-child(-n+5)
  width 10%
td
  vertical-align top
  padding 0.25rem 1rem
  white-space: break-spaces
.exclude-btn
    width 20px
    height 20px
    cursor pointer
    padding 0.25rem
    &:hover
        filter: drop-shadow(1px 1px 2px gray)
</style>
