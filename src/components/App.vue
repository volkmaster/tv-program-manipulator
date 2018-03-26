<style lang="less">
@import '../main';
</style>

<style lang="less" scoped>
@import (reference) '../main';

.app {
  min-height       : 100vh;
  padding          : 10px;
  display          : flex;
  align-items      : center;
  flex-direction   : column;
  background-color : @extremely-light-gray;
  animation        : fade-in 1s linear 0s forwards;

  @keyframes fade-in {
    from { opacity : 0; }
    to   { opacity : 1; }
  }
}

.app__title {
  padding             : 30px 0 10px 0;
  font-family         : @bold-text-font;
  font-size           : 40px;
  -webkit-user-select : none;
  -moz-user-select    : none;
  -ms-user-select     : none;
  user-select         : none;
}

.app__commands {
  margin         : 15px 0;
  display        : flex;
  align-items    : center;
  flex-direction : column;
}

.app__file-input {
  width    : 0;
  height   : 0;
  opacity  : 0;
  overflow : hidden;
  position : absolute;
  z-index  : -1;

  &:focus .app__button { background-color: @red; }
}

.app__file-error {
  padding     : 10px 0;
  color       : @dark-red;
  font-size   : 14px;
}

.app__button-wrapper { display: flex; }

.app__button-wrapper--check { margin-top: 20px; }

.app__button {
  width               : 150px;
  height              : 60px;
  padding             : 10px;
  border-width        : 2px;
  border-style        : solid;
  border-radius       : 5px;
  display             : flex;
  align-items         : center;
  justify-content     : center;
  font-family         : @grand-hotel-font;
  font-size           : 30px;
  cursor              : pointer;
  -webkit-user-select : none;
  -moz-user-select    : none;
  -ms-user-select     : none;
  user-select         : none;
  transition          : border-color 0.1s linear, background-color 0.1s linear;
}

.app__button--disabled {
  border-color     : @very-light-gray;
  background-color : @very-light-gray;
  color            : @gray;
  pointer-events   : none;

  .app__button-wrapper { cursor: not-allowed; }
}

.app__button--import {
  border-color     : @orange;
  background-color : @orange;

  &:hover:not(.app__button--disabled) {
    border-color     : @dark-orange;
    background-color : @dark-orange;
  }
}

.app__button--export {
  border-color     : @yellow;
  background-color : @yellow;

  &:hover:not(.app__button--disabled) {
    border-color     : @dark-yellow;
    background-color : @dark-yellow;
  }
}

.app__button--check {
  margin-right     : 5px;
  border-color     : @green;
  background-color : @green;

  &:hover {
    border-color     : @success-green;
    background-color : @success-green;
  }
}

.app__button--uncheck {
  margin-left      : 5px;
  border-color     : @red;
  background-color : @red;

  &:hover {
    border-color     : @dark-red;
    background-color : @dark-red;
  }
}

.app__table {
  width           : 100%;
  max-width       : 1230px;
  border-collapse : collapse;
}

.app__table-row { height: 20px; }

.app__table-row--header { border-bottom: 1px solid @gray; }

.app__table-row--body {
  border-bottom: 1px solid @very-light-gray;

  &:hover {
    background-color: @very-light-gray;

    .app__table-icon { opacity: 0.6; }
  }
}

.app__table-column { padding: 5px; }

.app__table-column--1 {
  width      : 10%;
  text-align : left;
}
.app__table-column--2 {
  width      : 60%;
  text-align : left;
}
.app__table-column--3 {
  width      : 10%;
  text-align : center;
}
.app__table-column--4 {
  width      : 10%;
  text-align : right;
}
.app__table-column--5 {
  width      : 10%;
  text-align : right;
}

.app__table-column--sortable {
  cursor: pointer;

  &:hover { background-color: @very-light-gray; }
}

.app__table-input {
  width   : 50px;
  padding : 2px;
}

.app__table-check-box { cursor: pointer; }

.app__table-column--command {
  width               : 60px;
  cursor              : pointer;
  -webkit-user-select : none;
  -moz-user-select    : none;
  -ms-user-select     : none;
  user-select         : none;
}

.app__table-icon {
  width      : 20px;
  height     : 20px;
  color      : @black;
  opacity    : 0;
  cursor     : pointer;
  transition : opacity 0.1s linear;

  &:hover { opacity: 1 !important; }
}

.app__table-icon--header {
  opacity: 1;
}
</style>

<template>
  <div class="app">

    <!-- Title -->
    <div class="app__title">{{ title }}</div>

    <!-- Commands -->
    <div class="app__commands">
      <input type="file" class="app__file-input" id="file" @change="importFile($event.target.files)" accept="json"/>
      <div class="app__button-wrapper">
        <label class="app__button app__button--import" :class="{ 'app__button--disabled': exporting }" for="file">Import</label>
      </div>
      <div class="app__file-error">{{ fileError }}</div>
      <div class="app__button-wrapper">
        <div class="app__button app__button--export" :class="{ 'app__button--disabled': importing }" @click="exportFile" v-if="hasData">Export</div>
      </div>
      <div class="app__button-wrapper app__button-wrapper--check">
        <div class="app__button app__button--check" @click="checkAll()" v-if="hasData">Check all</div>
        <div class="app__button app__button--uncheck" @click="uncheckAll()" v-if="hasData">Uncheck all</div>
      </div>
    </div>

    <!-- Data -->
    <table class="app__table" v-if="hasData">
      <thead>
        <tr class="app__table-row app__table-row--header">
          <th class="app__table-column app__table-column--sortable" :class="'app__table-column--' + (index + 1)" v-for="(value, key, index) in columns" @click="sortData(key, value)">{{ key }}</th>
          <th class="app__table-column app__table-column--4">
            <icon class="app__table-icon app__table-icon--header" name="arrow-up"></icon>
          </th>
          <th class="app__table-column app__table-column--5">
            <icon class="app__table-icon app__table-icon--header" name="arrow-down"></icon>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="app__table-row app__table-row--body" v-for="(row, index) in data">
          <td class="app__table-column app__table-column--1">
            <div @click="giveFocus(row)" v-show="!row['Focused']">{{ row['#'] }}</div>
            <input type="text" class="app__table-input" :id="'input_' + row['Program']" :value="row['#']" @change="onPositionChange(index, $event.target.value)" @blur="row['Focused'] = false" v-show="row['Focused']"/>
          </td>
          <td class="app__table-column app__table-column--2">{{ row['Program'] }}</td>
          <td class="app__table-column app__table-column--3">
            <input type="checkbox" class="app__table-check-box" @click="row['Included'] = !row['Included']" :checked="row['Included']"/>
          </td>
          <td class="app__table-column app__table-column--4 app__table-column--command">
            <icon class="app__table-icon" name="arrow-up" @click.native="moveUp(index)" v-show="index > 0"></icon>
          </td>
          <td class="app__table-column app__table-column--5 app__table-column--command">
            <icon class="app__table-icon" name="arrow-down" @click.native="moveDown(index)" v-show="index < data.length - 1"></icon>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import 'vue-awesome/icons/arrow-up'
import 'vue-awesome/icons/arrow-down'

export default {
  data () {
    return {
      title: 'TV PROGRAM MANIPULATOR',
      file: null,
      fileError: '',
      importing: false,
      exporting: false,
      data: [],
      columns: {
        '#': 'asc',
        'Program': 'asc',
        'Included': 'asc'
      }
    }
  },
  computed: {
    hasData () {
      return this.data.length > 0
    }
  },
  methods: {
    importFile (files) {
      this.importing = true

      if (files.length == 1) {
        this.fileError = ''

        const file = files[0]
        const extension = file.name.split('.').pop()

        if (extension !== 'json') {
          this.fileError = 'Only files of type JSON are allowed.'
          return
        }

        const context = this
        const reader = new FileReader()
        reader.readAsText(file, "UTF-8")
        reader.onload = function (event) {
          context.fillData(event.target.result)
          context.file = file
          context.importing = false
        }
        reader.onerror = function (event) {
          context.fileError = 'An error occurred while reading the file.'
          context.file = null
          context.importing = false
        }
      }
    },
    fillData (rawData) {
      this.data = []

      const input = JSON.parse(rawData)

      for (let i = 0; i < input.length; i++) {
        let row = input[i]
        this.data.push({
          '#': i + 1,
          'Program': row.id,
          'Included': true,
          'Focused': false
        })
      }
    },
    exportFile () {
      this.exporting = true

      const output = []

      for (let row of this.data) {
        if (row['Included']) {
          output.push({
            'id': row['Program'],
            'num': row['#']
          })
        }
      }

      const idx = this.file.name.lastIndexOf('.')
      const newFileName = this.file.name.substring(0, idx) + '_modified' + this.file.name.substring(idx)
      this.downloadFile(newFileName, JSON.stringify(output), 'application/json')

      this.exporting = false
    },
    downloadFile (fileName, data, type) {
      const blob = new Blob([data], { type: type })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      window.URL.revokeObjectURL(url)
    },
    checkAll () {
      for (let row of this.data) {
        row['Included'] = true
      }
    },
    uncheckAll () {
      for (let row of this.data) {
        row['Included'] = false
      }
    },
    sortData (key, direction) {
      this.columns[key] = direction === 'asc' ? 'desc' : 'asc'
      this.data = _.orderBy(this.data, key, this.columns[key])
    },
    giveFocus (row) {
      row['Focused'] = true
      this.$nextTick(() => this.$el.querySelector('#input_' + row['Program']).focus())
    },
    onPositionChange (currentIndex, input) {
      this.data[currentIndex]['Focused'] = false
      const newIndex = parseInt(input);
      if (!isNaN(newIndex)) {
        this.move(currentIndex, newIndex - 1);
      }
    },
    moveUp (currentIndex) {
      this.move(currentIndex, currentIndex - 1);
    },
    moveDown (currentIndex) {
      this.move(currentIndex, currentIndex + 1);
    },
    move (currentIndex, newIndex) {
      if (currentIndex !== newIndex && newIndex >= 0 && newIndex <= this.data.length - 1) {
        if (Math.abs(currentIndex - newIndex) === 1) {
          const temp = Object.assign({}, this.data[newIndex]);
          this.data[newIndex]['Program'] = this.data[currentIndex]['Program'];
          this.data[newIndex]['Included'] = this.data[currentIndex]['Included'];
          this.data[currentIndex]['Program'] = temp['Program'];
          this.data[currentIndex]['Included'] = temp['Included'];
        } else {
          const temp = this.data.splice(currentIndex, 1)[0];
          temp['#'] = newIndex + 1;
          this.data.splice(newIndex, 0, temp);

          if (newIndex > currentIndex) {
            for (let i = currentIndex; i < newIndex; i++) {
              this.data[i]['#'] -= 1
            }
          } else {
            for (let i = currentIndex; i > newIndex; i--) {
              this.data[i]['#'] += 1
            }
          }
        }
      }
    }
  }
}
</script>
