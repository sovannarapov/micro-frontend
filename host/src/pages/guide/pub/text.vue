<script lang="ts" setup>
const fields = reactive([
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'age', label: 'Age' },
]);
const items = reactive([
  { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
  { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
  {
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
  },
  { age: 38, first_name: 'Jami', last_name: 'Carney' },
]);
</script>

<template>
  <div class="contWrap">
    <div class="con_area">
      <ul class="title_area sub">
        <li><h2>Detail Content</h2></li>
      </ul>

      <div class="boardwrite">
        <table>
          <caption></caption>
          <colgroup>
            <col width="130px;" />
            <col width="" />
          </colgroup>
          <tbody>
            <tr>
              <th></th>
              <td>
                <div ref="tableau" class="boardlist">
                  <b-table :items="items" :fields="fields">
                    <template #cell(first_name)="row">
                      <b-form-input v-model="row.item.first_name" placeholder="Enter your name"></b-form-input>
                      <span style="visibility: hidden">{{ row.item.first_name }}</span>
                    </template>
                  </b-table>
                </div>
              </td>
            </tr>
            <tr>
              <th></th>
              <td>
                <div class="boardlist">
                  <b-table id="my-table" :items="items" :per-page="perPage" :current-page="currentPage"></b-table>
                </div>
              </td>
            </tr>
            <tr>
              <th></th>
              <td>
                <div ref="tableau" class="boardlist">
                  <b-table :items="items" :fields="fields">
                    <template #cell(first_name)="row">
                      <b-form-input v-model="row.item.first_name" placeholder="Enter your name"></b-form-input>
                      <span style="visibility: hidden">{{ row.item.first_name }}</span>
                    </template>
                  </b-table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
