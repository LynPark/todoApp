import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { theme } from "./color";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
  const [working, setWorking] = useState(true); //일과 여행 구분 위한 boolean 변수
  const travel = () => setWorking(false);
  const work = () => setWorking(true);

  const [text, setText] = useState('');
  const onChangeText = (payload) => setText(payload);

  const [todos, setTodos] = useState([])
  const addTodo = async () => {
    if (text === '') return;
    const newTodo = {
      id: Date.now(),
      text: text,
      working: working
    }
    const newTodos = [...todos, newTodo]
    setTodos(newTodos)
    setText('')
    await saveTodos(newTodos)
  }

  useEffect(() => {
    loadTodos();
  }, [])

  const loadTodos = async () => {
    try {
      const s = await AsyncStorage.getItem('my-todos')
      setTodos(s != null ? JSON.parse(s) : [])
    } catch (e) {
      console.log(e)
    }
  }

  const saveTodos = async (toSave) => {
    try {
      await AsyncStorage.setItem('my-todos', JSON.stringify(toSave))
    } catch (e) {
      console.log(e)
    }
  }

  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{ ...styles.btnText, color: working ? 'white' : theme.grey }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{ ...styles.btnText, color: !working ? 'white' : theme.grey }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addTodo}
          returnKeyLabel="완료"
          onChangeText={onChangeText}
          value={text}
          placeholder={working ? '할일 추가' : '어디로 여행 갈까요?'}
          style={styles.input}
        />
      </View>

      <ScrollView>
        {todos.map((todo) => (
          todo.working === working ? (
            <View style={styles.todo} key={todo.id}>
              <Text style={styles.todoText}>{todo.text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                <Text>❌</Text>
              </TouchableOpacity>
            </View>
          ) : null
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: '600',
    color: 'white',
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  todo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});