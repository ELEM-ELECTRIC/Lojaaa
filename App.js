import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function App() {
  const [stage, setStage] = useState("animation");
  const [animationShown, setAnimationShown] = useState(false);
  const [ageGroup, setAgeGroup] = useState(null);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState("+");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [showRestartButton, setShowRestartButton] = useState(false);
  const [fallNumbers, setFallNumbers] = useState([]);
  const [bgColor1, setBgColor1] = useState("#ffffff");
  const [bgColor2, setBgColor2] = useState("#ffffff");

  const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);

  function generateTask4_6() { generateTask(50); }
  function generateTask7_8() { generateTask(200); }
  function generateTask9_10() { generateTask(1000); }

  function generateTask(maxResult) {
    let op = Math.random() > 0.5 ? "+" : "-";
    let a = Math.floor(Math.random()*maxResult)+1;
    let b = Math.floor(Math.random()*maxResult)+1;

    if(op === "+") while(a+b>maxResult){ a=Math.floor(Math.random()*maxResult)+1; b=Math.floor(Math.random()*maxResult)+1;}
    if(op === "-") if(a-b<0)[a,b]=[b,a];

    setNum1(a); setNum2(b); setOperator(op); setAnswer("");
    setBgColor1(randomColor()); setBgColor2(randomColor());
  }

  useEffect(()=>{
    if(stage==="animation" && !animationShown){
      setAnimationShown(true);
      const numbers=[];
      for(let i=0;i<25;i++){
        const anim=new Animated.Value(-50-Math.random()*100);
        const left=Math.random()*(width-50);
        const value=Math.floor(Math.random()*9)+1;
        const color=randomColor();
        numbers.push({anim,left,value,color});
        setTimeout(()=>Animated.timing(anim,{
          toValue:height+50,
          duration:5000+Math.random()*2000,
          useNativeDriver:true
        }).start(), i*200);
      }
      setFallNumbers(numbers);
      const timer = setTimeout(()=>setStage("ageSelect"),7000);
      return ()=>clearTimeout(timer);
    }
  },[stage]);

  function checkAnswer() {
    let correct = operator==="+" ? num1+num2 : num1-num2;
    if(parseInt(answer)===correct){
      setScore(score+1);
      setTimeout(()=>{
        if(ageGroup===1) generateTask4_6();
        else if(ageGroup===2) generateTask7_8();
        else generateTask9_10();
      },500);
    } else {
      let remaining = lives-1;
      setLives(remaining);
      setAnswer("");
      if(remaining<=0) setShowRestartButton(true);
    }
  }

  function addNumber(n){ setAnswer(prev => n+prev); }
  function deleteNumber(){ setAnswer(prev => prev.slice(1)); }
  function clearAnswer(){ setAnswer(""); }
  function restartGame(){ setScore(0); setLives(3); setShowRestartButton(false); setStage("ageSelect"); }

  if(stage==="animation") return (
    <LinearGradient colors={[randomColor(),randomColor()]} style={styles.container}>
      <Text style={styles.appName}></Text>
      {fallNumbers.map((item,i)=>(
        <Animated.Text key={i} style={[styles.fallNumber,{left:item.left,transform:[{translateY:item.anim}], color:item.color}]}>{item.value}</Animated.Text>
      ))}
    </LinearGradient>
  );

  if(stage==="ageSelect") return (
    <LinearGradient colors={[randomColor(),randomColor()]} style={styles.container1}>
      <Text style={styles.appName}>Emir&Elif</Text>
      <Text style={{fontSize:22,color:"white",marginBottom:20}}>le te fillojm </Text>
      <View style={{flexDirection:"row"}}>
        <TouchableOpacity style={styles.ageButton} onPress={()=>{setAgeGroup(1); setStage("game"); generateTask4_6();}}>
          <Text style={styles.ageText}>Të lehta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ageButton} onPress={()=>{setAgeGroup(2); setStage("game"); generateTask7_8();}}>
          <Text style={styles.ageText}>Mesatare</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ageButton} onPress={()=>{setAgeGroup(3); setStage("game"); generateTask9_10();}}>
          <Text style={styles.ageText}>Të vështira</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  if(stage==="game") return (
    <LinearGradient colors={[bgColor1,bgColor2]} style={styles.container1}>
      {showRestartButton ? (
        <View style={styles.card}>
          <Text style={{fontSize:28,fontWeight:"bold"}}>🎯 ke fituar {score} ⭐: </Text>
          <TouchableOpacity style={styles.restartButton} onPress={restartGame}><Text style={styles.restartText}>Luaj përsëri</Text></TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.card,{backgroundColor:bgColor1}]}>
          <Text style={styles.score}>⭐ {score}   ❤️ {lives}</Text>
          <Text style={styles.task}>{num1} {operator} {num2} = ?</Text>
          <View style={styles.answerBox}><Text style={styles.answer}>{answer||""}</Text></View>
          <TouchableOpacity style={styles.check} onPress={checkAnswer}><Text style={styles.checkText}>OK</Text></TouchableOpacity>

          {/* Tastiera 3 ne nje rresht */}
          <View style={styles.keypad}>
            {[[1,2,3],[4,5,6],[7,8,9],["⌫",0,"C"]].map((row,i)=>(
              <View key={i} style={styles.row}>
                {row.map((n,j)=>(
                   <TouchableOpacity key={j} style={[styles.key,{backgroundColor:randomColor()}]} onPress={()=>{
                    if(n==="⌫") deleteNumber();
                    else if(n==="C") clearAnswer();
                    else addNumber(n.toString());
                  }}>
                    <Text style={styles.keyText}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

        </View>
      )}
    </LinearGradient>
  );

  return null;
}

const styles = StyleSheet.create({
  container:{flex:1,alignItems:"center",justifyContent:""},
  container1:{flex:1,alignItems:"center",justifyContent:"center"},
  appName:{fontSize:48,fontWeight:"bold",color:"white",marginBottom:30, textShadowColor:"#333", textShadowOffset:{width:2,height:2}, textShadowRadius:5},
  ageButton:{backgroundColor:"white",padding:8,margin:8,borderRadius:15, shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.3, shadowRadius:3, elevation:4},
  ageText:{fontSize:18,fontWeight:"bold"},
  card:{width:"90%",borderRadius:25,padding:20,alignItems:"center", shadowColor:"#000", shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:5, elevation:6},
  score:{fontSize:20,marginBottom:10},
  task:{fontSize:46,fontWeight:"bold",marginBottom:20},
  answerBox:{borderWidth:2,width:120,height:60,justifyContent:"center",alignItems:"center",borderRadius:10,marginBottom:10, borderColor:"#333"},
  answer:{fontSize:30},
  check:{backgroundColor:"#333",padding:10,borderRadius:10,marginBottom:10},
  checkText:{color:"white",fontSize:18},
  restartButton:{backgroundColor:"#f08080",padding:12,borderRadius:15,marginVertical:10},
  restartText:{color:"white",fontSize:20,fontWeight:"bold"},
  keypad:{marginTop:10},
  row:{flexDirection:"row",justifyContent:"center"},
  key:{width:70,height:70,margin:6,borderRadius:12,justifyContent:"center",alignItems:"center"},
  keyText:{fontSize:26,fontWeight:"bold"},
  fallNumber:{position:"absolute",fontSize:36,fontWeight:"bold", textShadowColor:"#000", textShadowOffset:{width:1,height:1}, textShadowRadius:3},
});