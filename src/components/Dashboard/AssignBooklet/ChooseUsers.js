import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useLocation } from 'react-router-dom';
import $ from 'jquery';
import Swal from 'sweetalert2';
import Loader from '../../Common/Loader';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Clear from '../Filter/Clear';
import DataTable from 'react-data-table-component';
import SelectFilter from '../Filter/SelectFilter';
import Select from 'react-select';
import TextFilter from '../Filter/TextFilter';
import { version } from 'react-dom';
import LoaderButton from '../../Common/LoaderButton';

const ChooseUsers = ({ selectedType, selectedUsername, selectedVersion }) => {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [assignableUssers, setAssignableUssers] = useState([]);
  const [bookletVersion, setBookletVersion] = useState('');
  const [btnLock, setBtnLock] = useState(false);

  const [bookletType, setBookletType] = useState('');
  const [bookletUsername, setBookletUsername] = useState('');
  const [bookletBatch, setBookletBatch] = useState('');
  const [bookletEmail, setBookletEmail] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [departments, setdepartments] = useState([]);
  const [selectedBooklet, setSelectedBooklet] = useState({
    label: '',
  });
  const [assignBooklet, setassignBooklet] = useState({
    id: '',
    assignedTo: [],
  });
  const [selectedDepartment, setSelectedDepartment] = useState({
    label: 'Please Select',
    value: '',
  });
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const data = [
    {
      name: '',
      batchNo: '',
      email: '',
      departmentId: null,
    },
  ];
  function convertArrayOfObjectsToCSV(array) {
    debugger;
    let result;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;
        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
  function downloadCSV(array) {
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  }

  const handleClear = () => {
    setBookletUsername('');
    setBookletEmail('');
    setSelectedDepartment({
      label: 'Please Select',
      value: '',
    });
    setBookletBatch('');
    setloader(true);
    fetch('https://etma-sql.herokuapp.com/api/user/SearchUsers', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '',
        email: '',
        departmentId: null,
        batchNo: '',
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setloader(false);
          setFilteredItems(result.data);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  };

  useEffect(() => {}, [resetPaginationToggle]);

  const [filteredItems, setFilteredItems] = useState([]);
  const [loader, setloader] = useState(true);
  useEffect(() => {
    fetch('https://etma-sql.herokuapp.com/api/booklets/GetPublishedBooklets')
      .then((res) => res.json())
      .then(
        (result) => {
          setloader(false);

          setItems(result.data);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  }, []);

  useEffect(() => {
    fetch('https://etma-sql.herokuapp.com/api/user/SearchUsers', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '',
        email: '',
        departmentId: null,
        batchNo: '',
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setloader(false);
          setFilteredItems(result.data);
          setAssignableUssers(result.data);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  }, []);

  const columns = [
    {
      name: 'Username',
      selector: 'UserName',
      sortable: true,
    },
    {
      name: 'Batch',
      selector: 'BatchNo',
      sortable: true,
    },
    {
      name: 'Department',
      selector: 'Department',
      sortable: true,
    },
    {
      name: 'Email',
      selector: 'Email',
      sortable: true,
    },
  ];

  const handleFilter = () => {
    setloader(true);
    fetch('https://etma-sql.herokuapp.com/api/user/SearchUsers', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: bookletUsername,
        email: bookletEmail,
        departmentId:
          selectedDepartment.label.toLowerCase() === 'please select'
            ? null
            : selectedDepartment.value.toString(),
        batchNo: bookletBatch,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          debugger;
          setloader(false);
          setFilteredItems(result.data);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  };

  const handleToggleChange = (state) => {
    setSelectedRows(state.selectedRows);
  };

  useEffect(() => {
    fetch(`https://etma-sql.herokuapp.com/api/departments/GetDepartments`)
      .then((res) => res.json())
      .then(
        (result) => {
          setdepartments(result.data);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  }, []);

  const handleAssign = (e) => {
    e.preventDefault();
    if (selectedRows.length === 0) {
      Swal.fire('Please Assign Users!', '', 'warning');
      return;
    }

    selectedRows.forEach((element) => {
      assignBooklet.assignedTo.push(element.UserId.toString());
    });

    assignBooklet.id = history.location.data.selectedUsername[0].id.toString();
    assignBooklet.qualificationType =
      history.location.data.selectedType.value.toString();
    assignBooklet.createdBy = 1;
    setBtnLock(true);

    fetch('https://etma-sql.herokuapp.com/api/booklets/assignBooklet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignBooklet),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        $('#exampleModal').find('.cancel-btn').trigger('click');

        if (data.code !== 1) {
          setBtnLock(false);

          Swal.fire({
            title: data.message,
            text: '',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ok',
            showCloseButton: false,
          });
        } else {
          setBtnLock(false);

          Swal.fire({
            title: 'Users Assigned',
            text: '',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ok',
            showCloseButton: false,
          });
          history.push('/booklet-assignment');
        }
      });
  };

  const exportPDF = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'portrait'; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = 'Booklets';
    const headers = [['Booklet Name', 'Batch', 'Department', 'Email']];

    const data = filteredItems.map((elt) => {
      return [elt.name, elt.batchNo, elt.department, elt.email];
    });

    let content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save('report.pdf');
  };
  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Booklet Assignement</title>
      </Helmet>
      <main className='manage-users-main'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <div className='dashboardheaderbar d-flex justify-content-between align-items-center'>
                <h1 className='dashboardtitle'>Booklet Assignement </h1>
                <div className='btngroup'>
                  <button
                    style={{ width: '120px', height: '45px' }}
                    type='button'
                    data-toggle='modal'
                    data-target='#exampleModal'
                    className='btn btn-outline-primary dashboardtitle-btn'
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-12'>
                <form className='add-new create-booklet-form'>
                  <div className='form-2'>
                    <div className='row form-inner-row'>
                      <div className='form-group name-field col-md-4'>
                        <label htmlFor='form-label'>Booklet Name</label>
                        <input
                          type='text'
                          className='form-control add-form-control'
                          id='version'
                          name='version'
                          placeholder='1.0.0'
                          required
                          value={
                            history.location.data
                              ? history.location.data.selectedUsername[0].name
                              : ''
                          }
                          disabled
                        />
                      </div>
                      <div className='form-group name-field col-md-4'>
                        <label htmlFor='form-label'>Booklet Version</label>
                        <input
                          type='text'
                          className='form-control add-form-control'
                          id='version'
                          name='version'
                          placeholder='1.0.0'
                          required
                          value={
                            history.location.data !== undefined
                              ? history.location.data.selectedVersion.label
                              : ''
                          }
                          disabled
                        />
                      </div>
                      <div className='form-group name-field col-md-4'>
                        <label htmlFor='form-label'>Repetion Type</label>
                        <input
                          type='text'
                          className='form-control add-form-control'
                          id='version'
                          name='version'
                          placeholder='1.0.0'
                          required
                          value={
                            history.location.data !== undefined
                              ? history.location.data.selectedType.label
                              : ''
                          }
                          disabled
                        />
                      </div>
                      <div className='form-group name-field col-md-4'>
                        <label htmlFor='form-label'>User Name</label>
                        <TextFilter
                          text={bookletUsername}
                          onFilter={(event) =>
                            setBookletUsername(event.target.value)
                          }
                          placeholder={'Enter Username'}
                        />
                      </div>
                      <div className='form-group name-field col-md-4'>
                        <label htmlFor='form-label'>BatchNo</label>
                        <TextFilter
                          text={bookletBatch}
                          onFilter={(event) =>
                            setBookletBatch(event.target.value)
                          }
                          placeholder={'Enter BatchNo'}
                        />
                      </div>
                      <div className='form-group name-field col-md-4'>
                        <label htmlFor='form-label'>Department</label>
                        <Select
                          className='basic-multi-select '
                          classNamePrefix='select'
                          onChange={(option) => setSelectedDepartment(option)}
                          value={selectedDepartment}
                          options={
                            departments.length === 0
                              ? [
                                  {
                                    value: '',
                                    label: 'Loading...',
                                  },
                                ]
                              : departments.map(function (item) {
                                  return {
                                    value: item.DepartmentId,
                                    label: item.Description,
                                  };
                                })
                          }
                        />
                      </div>
                      <div className='form-group name-field col-md-4'>
                        <label htmlFor='form-label'>Email</label>
                        <TextFilter
                          text={bookletEmail}
                          onFilter={(event) =>
                            setBookletEmail(event.target.value)
                          }
                          placeholder={'Enter Email'}
                        />
                      </div>
                      <div
                        className='form-group name-field col-md-8'
                        style={{ alignSelf: 'flex-end' }}
                      >
                        <div
                          className='btngroup'
                          style={{ textAlign: 'right' }}
                        >
                          <button
                            onClick={handleFilter}
                            type='button'
                            className='btn btn-outline-primary dashboardtitle-btn'
                            style={{ width: '110px', height: '40px' }}
                          >
                            Filter
                          </button>
                          <Clear onClear={handleClear} />
                        </div>
                      </div>
                      <div className='form-group name-field col-md-4'></div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className='row mb-4' style={{ marginTop: '30px' }}>
            <div className='col-12 mb-4'>
              <div className='card'>
                <div className='card-body table-inner'>
                  {loader ? (
                    <Loader />
                  ) : (
                    <>
                      <div class='exportbtns'>
                        <h2
                          style={{
                            fontFamily: 'Poppins',
                            fontSize: '15px',
                            fontWeight: '500',
                            color: '#313131',
                            marginBottom: '15px',
                          }}
                        >
                          Export to:{' '}
                        </h2>
                        <button className='dt-button' onClick={exportPDF}>
                          PDF
                        </button>
                        <button
                          className='dt-button'
                          onClick={() => downloadCSV(filteredItems)}
                        >
                          CSV
                        </button>
                      </div>
                      <DataTable
                        title=''
                        columns={columns}
                        data={filteredItems}
                        pagination
                        subHeader
                        persistTableHead
                        selectableRows
                        onSelectedRowsChange={handleToggleChange}
                        paginationResetDefaultPage={resetPaginationToggle}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div
        class='modal fade chooseusertable'
        id='exampleModal'
        tabindex='-1'
        role='dialog'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div class='modal-dialog modal-dialog-centered ' role='document'>
          <div class='modal-content'>
            <p>
              Are you sure you want to Assign{' '}
              <span>
                {history.location.data !== undefined
                  ? history.location.data.selectedUsername[0].name
                  : ''}
              </span>{' '}
              of Version{' '}
              <span>
                {' '}
                {history.location.data !== undefined
                  ? history.location.data.selectedVersion.label
                  : ''}
              </span>{' '}
              having{' '}
              <span>
                {history.location.data !== undefined
                  ? history.location.data.selectedType.label
                  : ''}
              </span>{' '}
              Type to the following Users?{' '}
            </p>
            <table
              className='data-table data-table-feature users'
              id='data-table-etma'
            >
              <thead>
                <tr>
                  <th>Sr. No</th>
                  <th hidden>Booklet Id</th>
                  <th>Username</th>
                  <th>Batch</th>
                  <th>Department</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {selectedRows.map((item, index) => {
                  return (
                    <tr id={item.BookletId} key={item.BookletId}>
                      <td>{index + 1}</td>
                      <td hidden>{item.BookletId}</td>
                      <td>{item.UserName}</td>
                      <td>{item.BatchNo}</td>
                      <td>{item.Department}</td>
                      <td>{item.Email}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div
              className='form-btns'
              style={{
                justifyContent: 'flex-end',
                display: 'flex',
                marginBottom: '0',
              }}
            >
              <button
                type='button'
                className='btn form-btn btn-primary cancel-btn mb-0'
                data-dismiss='modal'
              >
                Cancel
              </button>
              <button
                disabled={btnLock}
                style={{ marginLeft: '20px', marginRight: '0' }}
                id='publishbtn'
                className='btn form-btn btn-outline-primary apply-btn mb-0'
                onClick={handleAssign}
              >
                Assign
                {btnLock ? <div class='btnloader'>{LoaderButton}</div> : ''}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChooseUsers;
