<template>
    <div>
        <input type="number" placeholder="세로" value="row" v-on:change="onChangeRow" />
        <input type="number" placeholder="가로" value="cell" v-on:change="onChangeCell" />
        <input type="number" placeholder="지뢰" value="mine" v-on:change="onChangeMine" />
        <button v-on:click="onClickBtn">시작</button>
    </div>
</template>

<script>

import { START_GAME } from './store';
export default {
    /*
    지역데이터 vuex의 store기능을 사용중이지만 
    이 컴포넌트에서만 사용할 데이터는 store에 만들지않고
    따로 data칸을 만들어서 사용하는것도 가능하다.
    */
    data(){
        return {
            row:10,
            cell:10,
            mine:20,
        };
    },
    methods:{
        onChangeRow(e){
            this.row = e.target.value;
        },
        onChangeCell(e){
            this.cell = e.target.value;
        },
        onChangeMine(e){
            this.mine = e.target.value;
        },
        //e.target.value; 이벤트가 일어난 곳의 value값.
        onClickBtn(){
            this.$store.commit(START_GAME,{ row:this.row , cell:this.cell , mine:this.mine })
        //▲지역적으로 만들어진 data를 vuex로 보내기
        }
    }
}
</script>
