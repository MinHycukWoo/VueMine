<template>
<table>
    <tr v-for="(rowData,rowIndex) in tableData" v-bind:key="rowIndex">
        <td 
        v-for="(cellData,cellIndex) in rowData" 
        v-bind:key="cellIndex"
        v-bind:style="cellDataStyle(rowIndex,cellIndex)"
        v-on:click="onClickTd(rowIndex, cellIndex)"
        v-on:contextmenu.prevent="onRightClickTd(rowIndex,cellIndex)"
        >
              {{cellDataText(rowIndex, cellIndex)}}</td>
              <!--칸마다 달라지는 rowIndex, cellIndex를 알아차리기 힘들어서
              각 칸별로 따로 계산할 수 있도록
              contextmenu = 우클릭
              contextmenu.prevent 우클릭 기존동작 잠김
              -->
    </tr>
</table>
</template>

<script>
import { mapState } from 'vuex';
import { CODE } from './store';
import {OPEN_CELL ,
        FLAG_CELL ,
        QUESTION_CELL ,
        NORMALIZE_CELL,
        CLICK_MINE
         }  from './store';

export default {
    computed : {
        ...mapState(['tableData', 'halted']),

        /*
        고차함수 패턴는 함수를 확장하는 행위이고 
        cellDataStyle:(state) => (row, cell) => {
        state뒤에 인자를 붙여서 정확한 위치를 추가해주고
        => 화살표 함수를 쓰면 this를 사용할수 없다.
        */
        cellDataStyle(state)  {
            return (row, cell) => {
            switch(this.$store.state.tableData[row][cell]){
                case CODE.NORMAL:
                case CODE.MINE:
                    return{
                        background:'#444',
                    }
                case CODE.CLICK_MINE:
                case CODE.OPENED:
                    return{
                        background: 'white',
                    }
                case CODE.FLAG:
                case CODE.FLAG_MINE:
                    return{
                        background:'red',
                    }
                case CODE.QUESTION:
                case CODE.QUESTION_MINE:
                    return {
                        background:'yellow',
                    }
                default:
                /*각칸을 검사한다. */
                    return {};
            }
            };
        },
        cellDataText() {
            return (row, cell) => {
            switch(this.$store.state.tableData[row][cell]){
                case CODE.MINE:
                    return "X";
                case CODE.NORMAL:
                    return "";
                case CODE.FLAG_MINE:
                case CODE.FLAG:
                    return "!";
                case CODE.QUESTION_MINE:
                case CODE.QUESTION:
                    return "?";
                case CODE.CLICKED_MINE:
                    return "펑!";
                default:
                    return this.$store.state.tableData[row][cell] || '';
                    //기본값은 해당 위치값,

                }
            };
        },
    },
    methods:{
        onClickTd(row, cell){
            if(this.halted){
                return;
            }
            switch(this.tableData[row][cell]){
                case CODE.NORMAL:
                    return this.$store.commit(OPEN_CELL,{row , cell})
                case CODE.MINE:
                    return this.$store.commit(CLICK_MINE,{row, cell})
                default:
                return;
            }

            this.$store.commit(OPEN_CELL,{ row,cell });
        },
        onRightClickTd(row, cell){
            if(this.halted){
                return;
            }
            switch(this.tableData[row][cell]){
                case CODE.NORMAL:
                case CODE.MINE:
                    this.$store.commit(FLAG_CELL,{ row, cell});
                    return;
                case CODE.FLAG_MINE:
                case CODE.FLAG:
                    this.$store.commit(QUESTION_CELL,{row, cell});
                    return;
                case CODE.QUESTION_MINE:
                case CODE.QUESTION:
                    this.$store.commit(NORMALIZE_CELL,{row, cell});
                    return;
                /*

                    case CODE.QUESTION_MINE:
                    case CODE.QUESTION:
                    두가지 경우인 이유는 최종적으로 원상태로 돌릴떄 mine은 mine로 normal은 normal로 돌리기 위해서다.
                    우클릭을 계속하여 한바퀴 돌경우 떄문.
                */
                
            }
        }
    }
};
</script>
