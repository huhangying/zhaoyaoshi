import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CheckBox } from "react-native-elements";
import { TextInput } from "react-native-paper";
import { Question } from "../../../models/survey/advise-template.model";


export default function SurveyQuestions({ questions, readonly, onChange }:
  { questions: Question[], readonly?: boolean, onChange?: any }) {

  const changeRadioSelection = (question: Question, index: number, oIndex: number, value?: boolean) => {
    if (questions[index]) {
      questions[index].options = questions[index].options.map((option, i) => {
        if (question.answer_type === 0 || question.answer_type === 1) { // 单选
          option.selected = i === oIndex;
        } else if (question.answer_type === 2) { // 多选
          if (i === oIndex) {
            option.selected = !option.selected;
          }
        }
        return option;
      });
    }
    onChange(questions);
    // console.log('--->', questions[index]);
  }

  const setQuestionAnswerInput = (question: Question, index: number, value: any) => {
    if (questions[index] && questions[index].options[0]?.answer !== value) {
      questions[index].options[0].answer = value;
      onChange(questions);
      // console.log('==>', questions[index]);
    }
  }

  return (<>
    { questions?.map((question, i) => (
      <View key={'question-section-' + i} style={{ marginTop: 4 }}>
        <Text key={'question-' + i} style={styles.question}>
          {i + 1}. {question.question}
        </Text>

        { question.answer_type !== 3 &&
          question.options?.map((opt, oIndex) => (
            <CheckBox 
              key={i + '-' + oIndex}
              title={opt.answer}
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={opt.selected}
              onPress={() => { changeRadioSelection(question, i, oIndex, opt.selected) }}
              containerStyle={styles.questionCheckbox}
            />
          ))
        }
        { question.answer_type === 3 && question.options?.length &&
          <TextInput
            key={'input-' + i}
            placeholder="请输入..."
            onEndEditing={event => setQuestionAnswerInput(question, i, event.nativeEvent.text)}
            style={styles.questionInput}
          />
        }
      </View>
    ))
    }
  </>);
}


const styles = StyleSheet.create({
  question: {
    color: 'red',
    paddingVertical: 8,
  },
  questionCheckbox: {
    backgroundColor: 'white',
    borderColor: 'white',
    width: '100%',
  },
  questionInput: {
    backgroundColor: 'white',
    width: '100%',
  },
});
