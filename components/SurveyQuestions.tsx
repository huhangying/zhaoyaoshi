import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CheckBox, ListItem } from "react-native-elements";
import { TextInput } from "react-native-paper";
import { Question } from "../models/survey/advise-template.model";


export default function SurveyQuestions({ questions, readonly, onChange }:
  { questions: Question[], readonly?: boolean, onChange?: any }) {
  // const initQuestions: Question[] = [];
  // const [questions, setQuestions] = useState(initQuestions)

  // useEffect(() => {
  //   setQuestions(questionList)

  //   return () => {
  //     setQuestions([])
  //   }
  // }, [questionList])

  const changeRadioSelection = (question: Question, index: number) => {
    if (readonly) return;
    // const checked = options[index].selected;
    question.options.forEach((option, i) => option.selected = i === index);

    onChange(questions);
    // console.log(questions);
  }

  const setQuestionAnswerInput = (question: Question, value: any) => {
    if (readonly) return;
    // const checked = options[index].selected;    
    question.options[0].answer = value;
    // setQuestions(questions);
    onChange(questions);

    // this.markDirty();
  }

  return (<>
    { questions?.map((question, i) => (
      <ListItem key={i} bottomDivider
        style={{ marginTop: 4 }}>
        <ListItem.Content>
          <ListItem.Title style={styles.question}>
            {i + 1}. {question.question}
          </ListItem.Title>
          <ListItem.Subtitle style={styles.answer}>
            {(() => {
              const _question = { ...question };
              switch (_question.answer_type) {
                case 0:
                case 1:
                  return (_question.options?.map((opt, oIndex) => (
                    <CheckBox
                      key={i + '-' + oIndex}
                      title={opt.answer}
                      checkedIcon='dot-circle-o'
                      uncheckedIcon='circle-o'
                      checked={opt.selected}
                      onPress={() => { changeRadioSelection(_question, oIndex) }}
                      containerStyle={styles.checkBoxItem}
                    />
                  ))
                  );
                case 2:
                  return (_question.options?.map((opt, oIndex) => (
                    <CheckBox
                      key={i + '-' + oIndex}
                      title={opt.answer}
                      checkedIcon='dot-circle-o'
                      uncheckedIcon='circle-o'
                      checked={opt.selected}
                      onPress={() => { changeRadioSelection(_question, oIndex) }}
                      containerStyle={styles.checkBoxItem}
                    />
                  ))
                  );
                case 3:
                  return (_question.options?.length &&
                    <TextInput
                      key={'input-' + i}
                      placeholder="请输入..."
                      value={question.options[0].answer}
                      editable={!readonly}
                      onEndEditing={text => setQuestionAnswerInput(_question, text)}
                      style={styles.inputStyle}
                    />
                  );
              }
            })()}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    ))
    }
  </>);
}

const styles = StyleSheet.create({
  question: {
    color: 'red',
    paddingVertical: 8,
  },
  answer: {
    paddingHorizontal: 16,
  },
  checkBoxItem: {
    backgroundColor: 'white',
    borderColor: 'white',
    paddingVertical: 2,
  },
  inputStyle: {
    backgroundColor: 'white',
    width: '100%',
  },
  mr3: {
    marginRight: 22,
  }
});
