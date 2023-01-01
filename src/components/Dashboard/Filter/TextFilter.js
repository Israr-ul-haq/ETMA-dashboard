function TextFilter({ text, onFilter, placeholder }) {
  return (
    <input
      type='text'
      className='form-control add-form-control'
      id='tasktype'
      name='tasktype'
      placeholder={placeholder}
      required
      value={text}
      onChange={onFilter}
    />
  );
}

export default TextFilter;
