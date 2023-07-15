<template>
    <div class="timer">
        <div class="navBar">
            <h4>Count Down Timer</h4>
            <div class="settings">
                <label for="duration">Duration: </label><input class="duration" type="text" v-on:blur="setTime" v-model="setDuration">
                <label for="warning"> Warn: </label><input class="warning" type="text" v-on:blur="setWarn" v-model="setWarning">
                <label for="sound"> Sound </label><input id="sound" type="checkbox" v-model="isSound" >
            </div>
            <div class="navContent">
                <button class="btnStart" @click="startClock">Start</button>
                <button class="btnStop" @click="stopClock">Stop</button>
                <button class="btnPlus" @click="increaseTime"><i class="ri-add-circle-line"></i></button>
                <button class="btnMinus" @click="decreaseTime"><i class="ri-indeterminate-circle-line"></i></button>
                <button class="btnReset" @click="resetClock">Reset</button>
            </div>
        </div>
        <div class="timeClock" ref="timeClock"><span>{{clockTime}}</span></div>
    </div>
  
</template>

<script>
import gong from '@/assets/gong.mp3'

export default {
    name:"Countdown",
    data(){
         //match the timer in seconds equal to setDuration string
        let timer=60
        let setDuration='01:00'
        let clockTime='mm:ss'
        let setSeconds=0
        let setMinutes=0
        // set warning in seconds equal to setWarning string
        let setWarning='00:10'
        let warning=10
        let isSound=false
        
        return{
            timer,
            setDuration,
            clockTime,
            setSeconds,
            setMinutes,
            setWarning,
            warning,
            isSound,
        }
    },
    mounted(){
        this.audio = new Audio(gong);
        this.$refs.timeClock.backgroundColor='none'
    },
    methods:{
        // all times are in seconds
        PlaySound(){
                this.audio.play();
        },
        setTime(){
            // event on blur of duration time
            // convert string to seconds
            let time =  this.setDuration.split(":")
            this.timer = 0
            if(time.length==1){
                this.timer = time[0] *1
            } else if (time.length==2){
                this.timer = (time[0] * 60) + (+ time[1] *1)
            }
        },
        setWarn(){
            // event on blur of warning time
            // convert string to seconds
            let warn =  this.setWarning.split(":")
            this.warning = 0
            if(warn.length==1){
                this.warning = warn[0] *1
            } else if (warn.length==2){
                this.warning = (warn[0] * 60) + (+ warn[1] *1)
            }
        },
        resetClock(){
            this.$refs.timeClock.style.backgroundColor='white'
            this.setTime()
            this.displayTime()
        },
        startClock(){
            --this.timer
            this.countdown()
        },
        stopClock(timeOut){
            clearInterval(this.myTimer)
            if(timeOut && this.isSound){
                this.PlaySound()
            }
        },
        decreaseTime(){
            --this.timer
            this.displayTime()
        },
        increaseTime(){
            ++this.timer
            this.displayTime()
        },
        displayTime(){
                var minutes = parseInt(this.timer / 60, 10);
                var seconds = parseInt(this.timer % 60, 10);
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                this.clockTime = minutes + ":" + seconds;
        },
        countdown(duration) {
            //var timer = this.timer, minutes, seconds;
           
            var _this = this
            let clockDiv=_this.$refs.timeClock
            this.myTimer = setInterval(function () {
                clockDiv.style.backgroundColor='white'
                _this.displayTime()

                if(_this.timer <= _this.warning){
                    console.log('warning')
                    clockDiv.style.backgroundColor='yellow'
                }

                if (--_this.timer < 0) {
                    clockDiv.style.backgroundColor='red'
                    _this.stopClock(true)
                }
            }, 1000);
        }
    }
}
</script>

<style scoped>
.timer{
    display:flex;
    flex-direction: column;
    align-items: center;
    height:100vh;
    width:100vw;
    background-color: lightgray;
}
.timer .navBar{
    display:flex;
    flex-direction: column;
    padding-bottom:10px;
}
.timer .navContent{
    display:flex;
    align-items: center;
    justify-content: space-evenly;
    width:400px;
}
.timer .settings{
    display:flex;
    height:1.5em;
    margin:10px 0 15px 0;
}
.timer input{
    background-color:white;
}
.timer .duration{
    width:50px;
    font-weight: bold;
    margin:0 5px 0 0 ;
}
.timer .warning{
    width:50px;
    font-weight: bold;
    margin:0 5px 0 0 ;
}
.timer button{
    height:40px;
    width:70px;
    font-weight: bold;
    font-size:large;
}
.timer .btnStart{
    background-color: palegreen;
}
.timer .btnStop{
    background-color:palevioletred;
}
.timer .btnReset{
    background-color: lightskyblue;
}
.timer .btnPlus{
    font-size:30px;
    padding-top:3px
}
.timer .btnMinus{
    font-size:30px;
    padding-top:3px
}
.timer .timeClock{
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding:0 25px;
    font-size:18em;
    background-color: white;
    border: solid black 10px;
    border-radius: 15px;
}
</style>