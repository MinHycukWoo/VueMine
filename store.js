import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export const START_GAME = "START_GAME";
export const OPEN_CELL = "OPEN_CELL";
export const CLICK_MINE = "CLICK_MINE";
export const FLAG_CELL = "FLAG_CELL";
export const QUESTION_CELL = "QUESTION_CELL";
export const NORMALIZE_CELL = "NORMALIZE_CELL";
export const INCREMENT_TIMER = "INCREMENT_TIMER";

export const CODE = {
    MINE : -7,
    NORMAL : -1,
    QUESTION: -2,
    FLAG: -3,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    CLICKED_MINE: -6,
    OPENED: 0,
}

/*
2차원 배열 
기본 
    [[-1],[-1],[-1]],
    [[-1],[-1],[-1]],
    [[-1],[-1],[-1]],
    기본인 상태 NORMAL은 -1로 표기 상태변화에 따라 CODEDATA가 변경
    0이상은 열었는 칸이고 근처 지뢰의 수에따라 수가 바뀐다.

재귀함수
    작성중인 함수 안에서 함수본인을 호출하는것.
    하지만 처음에는 누군가 자기를 한번 시작해 주어야 작동한다.

*/
const plantMine = (row , cell , mine) => {
    console.log(row, cell ,mine);
    const candidata = Array(row * cell).fill().map((arr, i) => {
        return i;
    });
const shuffle = [];
while (candidata.length > row * cell - mine){
    const chosen = candidata.splice(Math.floor(Math.random()*candidata.length),1)[0];
    shuffle.push(chosen);
}
const data = [];
for (let i = 0; i < row ; i++){
    const rowData = [];
    data.push(rowData);
    for(let j = 0; j < cell ; j++){
        rowData.push(CODE.NORMAL)
    }
}
for(let k = 0; k < shuffle.length; k++){
    const ver = Math.floor(shuffle[k]/cell);
    const hor = shuffle[k] % cell;
    data[ver][hor] = CODE.MINE;
}
console.log(data);
return data;
};

export default new Vuex.Store({

    

    state:{
        tableData:[],
        data:{//관련있는거라 데이터로 하나로 묶음
            row:0,
            cell:0,
            mine:0,
        },
        timer:0,
        halted:true,//게임이 중단됨
        result:0,
        openedCount:0,
    },
    getters:{
    },

    mutations:{
        [START_GAME](state,{ row, cell, mine }){
            //이 함수는 실행할때 인자로 row cell mine를 받아옵니다. 이를 구조분해 한다고 한다.
            //원하는 숫자만큼 칸만들기.
            //객체안에 속성을 바꿀경우 화면이 안바뀔수가 있다.이경우 vue.set을 사용.
            /*
                (x)state.data.row = row; 화면이 바뀌지 않음.
                state.data.row = row;
                Vue.set(state.data, 'row', row);
            */
            state.data = {
                row,
                cell,
                mine,
            }
            state.tableData = plantMine(row , cell , mine);
            state.timer = 0;
            state.halted = false; //게임이 지냏ㅇ됨
            state.openedCount = 0;
            state.result = '';
        },

        [OPEN_CELL](state,{row, cell}){
            let openedCount = 0;
            const checked = [];
            function checkAround(row , cell){
                const chekedRowOrCellIsUndefined = row < 0 || row >= state.tableData.length || cell < 0 || cell >= state.tableData[0].length
                if (chekedRowOrCellIsUndefined){
                    return;
                }
                if([CODE.OPENED , CODE.FLAG , CODE.FLAG_MINE , CODE.QUESTION_MINE , CODE.QUESTION ].includes(state.tableData[row][cell])){
                    return;
                }//▲이미 연칸이면 실행안함
                if(checked.includes(row + '/' + cell)){
                    return;
                }else{
                    checked.push(row + '/' + cell);
                //열지 않은 칸이면 열면서 checked에 추가    
                }

                let around = [];
                    if( state.tableData[row - 1] ){ //최상단일 경우 대비
                    around = around.concat([
                    //.concat() 속성을 이용하여 기존 배열에 원소 또는 배열을 추가하여 새 배열을 만들 수 있습니다.
                    state.tableData[row - 1][cell - 1],
                    state.tableData[row - 1][cell],
                    state.tableData[row - 1][cell + 1]
                    ]);
                    }

                    around = around.concat([
                            state.tableData[row][cell - 1],
                            state.tableData[row][cell + 1]
                    ]);

                    if( state.tableData[row + 1] ){ //최하단일 경우 대비
                    around = around.concat([
                        state.tableData[row + 1][cell - 1],
                        state.tableData[row + 1][cell],
                        state.tableData[row + 1][cell + 1]
                    ]);
                    }
                    const counted = around.filter(function(v){
                        return [CODE.MINE, CODE.FLAG_MINE , CODE.QUESTION_MINE].includes(v);
                        //.includes()는 문자열이 특정 문자열을 포함하는지 확인하는 메서드입니다. IE는 Edge부터 지원합니다.
                    });

                    if(counted.length === 0 && row > -1){//주변칸에 지뢰가 하나도 없으면
                        const near = [];
                        if(row - 1 > -1){
                            near.push([row - 1 , cell - 1]);
                            near.push([row - 1 , cell]);
                            near.push([row - 1 , cell + 1]);
                        }
                            near.push([row , cell - 1]);
                            near.push([row , cell + 1]);
                        if(row + 1 < state.tableData.length){
                            near.push([row + 1 , cell - 1]);
                            near.push([row + 1 , cell]);
                            near.push([row + 1 , cell + 1]);
                        }
                            near.forEach((n) => {
                                if(state.tableData[n[0]][n[1]] !== CODE.OPENED) {
                                    checkAround( n[0], n[1] );
                                }
                            });
                        }
                        if(state.tableData[row][cell] === CODE.NORMAL){
                            openedCount += 1;
                        }
                        Vue.set(state.tableData[row],cell, counted.length);
                        //▲기본값을 주변지뢰갯수 값으로 바꾸는곳.
                    }
                    
                    checkAround(row , cell);
                    let halted = false;
                    let result = '';
                    if (state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount){
                        halted = true;
                        result = `${state.timer}초만에 승리 하였습니다.`
                    };
                    state.openedCount += openedCount;
                    state.halted = halted;
                    state.result = result;
        },

        [CLICK_MINE](state,{row, cell}){
            state.halted = true;
            Vue.set(state.tableData[row], cell, CODE.CLICKED_MINE );

        },

        [FLAG_CELL](state,{row , cell}){
            if(state.tableData[row][cell] === CODE.MINE){
                Vue.set(state.tableData[row],cell, CODE.FLAG_MINE);
            }else{
                Vue.set(state.tableData[row],cell, CODE.FLAG)
            }
        },

        [QUESTION_CELL](state,{row , cell}){
            if(state.tableData[row][cell] === CODE.FLAG_MINE){
                Vue.set(state.tableData[row],cell, CODE.QUESTION_MINE);
            }else{
                Vue.set(state.tableData[row],cell ,CODE.QUESTION)
            }
        },

        [NORMALIZE_CELL](state,{row , cell}){
            if(state.tableData[row][cell] === CODE.QUESTION_MINE){
                Vue.set(state.tableData[row],cell, CODE.MINE);
            }else{
                Vue.set(state.tableData[row],cell ,CODE.NORMAL);
            }
        },

        [INCREMENT_TIMER](state){
            state.timer += 1;
        },

    },
    actions:{

    },
});