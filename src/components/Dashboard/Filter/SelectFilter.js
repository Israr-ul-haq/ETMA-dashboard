import Select from 'react-select';
function SelectFilter({ booklets, onFilter, selectedBooklet }) {
  return (
    <Select
      className='basic-multi-select '
      classNamePrefix='select'
      onChange={onFilter}
      value={selectedBooklet}
      options={
        booklets.length === 0
          ? [
              {
                value: '',
                label: 'Loading...',
              },
            ]
          : booklets.map(function (item) {
              return { value: item.id, label: item.name };
            })
      }
    />
  );
}

export default SelectFilter;
