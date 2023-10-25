import React, { useState } from 'react';
import { postChatGpt, useChat } from './Api';

const GptTest = () => {
  const [question, setQuestion] = useState('');
  const [submittedQuestion, setSubmittedQuestion] = useState('');

  const response = useChat(submittedQuestion);

  const handleQuestionChange = (event: any) => {
    setQuestion(event.target.value);
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Do something with the question and response
    console.log(`Question: ${submittedQuestion}\nResponse: `);
    console.log(response);

    // setSubmittedQuestion(question);
    // postChatGpt(question);
  }

  const handleClear = (event: any) => {
     // Clear the form
     setQuestion('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Question:
        <input type="text" value={question} onChange={handleQuestionChange} />
      </label>
      <br />
      <label>
        Response:
        <textarea readOnly value={response.chatResponse} />
      </label>
      <br />
      <button type="submit">Submit</button>
      <button type="button" onClick={handleClear}>Clear</button>
    </form>
  );
}

export default GptTest;