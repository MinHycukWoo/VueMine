<!--
-->

<template>
    <div>
        <mine-form></mine-form>
        <div>{{timer}}</div>
        <table-component></table-component>
        <div>{{result}}</div>
    </div>
</template>

<script>
    import { mapState } from "vuex";

    import store, { 
        START_GAME,
        OPEN_CELL,
        CLICK_MINE,
        FLAG_CELL,
        QUESTION_CELL,
        NORMALIZE_CELL,
        INCREMENT_TIMER
     } from "./store";
     import MineForm from './MineForm';
     import TableComponent from './TableComponent';
    

    let interval

    export default{
        store,
        components:{
            TableComponent,
            MineForm,
        },
        computed:{
            ...mapState([
                'timer',
                'result',
                'halted'
            ])
        },
        methods: {

        },
        watch: {//watch를 남용하면 안좋지만 적절히 사용하면 편리하다.
            halted(value, oldValue) {
                if (value === false ) {// flase일때 게임 시작
                interval = setInterval(() => {
                    this.$store.commit(INCREMENT_TIMER);
                }, 1000);
            } else { //게임중단 true가 되었을때.
                clearInterval(interval);
            }
          } 
        }
    };
</script>

<style>
    table{
        border-collapse: collapse;
    }
    td{
        border: 1px solid black;
        width:40px;
        height:40px;
        text-align:center;
    }
</style>

