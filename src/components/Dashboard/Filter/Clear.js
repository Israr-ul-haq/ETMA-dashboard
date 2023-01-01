function Clear({ onClear }) {
  return (
    <button
      type='button'
      className='btn btn-outline-primary dashboardtitle-btn dashboardtitle-outline-btn'
      onClick={onClear}
      style={{ width: '110px', height: '40px', marginLeft: '20px' }}
    >
      Clear All
    </button>
  );
}

export default Clear;
