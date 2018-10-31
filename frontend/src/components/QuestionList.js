import React from 'react';
import Question from './Question';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  list: {
    flex: '1',
  },
  listItem: {
    padding: '0',
    margin: '0px 0px 10px 0px',
  },
  addButton: {
    textAlign: 'center',
  },
  errMsg: {
    textAlign: 'center',
    color: 'red',
  },
});

const QuestionList = ({
  questions,
  classes,
  onTextChange,
  onColorChange,
  onDeleteItem,
  onAddItem,
  errorMessage,
}) => (
  <List className={classes.list}>
    {questions.map((question) => (
      <ListItem key={question.id} className={classes.listItem}>
        <Question
          {...question}
          onTextChange={onTextChange}
          onColorChange={onColorChange}
          onDeleteItem={onDeleteItem}
        />
      </ListItem>
    ))}
    <div className={classes.addButton}>
      <Button color="primary" onClick={onAddItem}>
        + Add Question
      </Button>
    </div>
    {errorMessage !== '' ? (
      <div className={classes.errMsg}>{errorMessage}</div>
    ) : null}
  </List>
);

export default withStyles(styles)(QuestionList);
