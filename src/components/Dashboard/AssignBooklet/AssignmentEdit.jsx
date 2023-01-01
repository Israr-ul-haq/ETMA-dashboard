import { Link, useParams, useHistory } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
function AssignmentEdit() {
  const [booklet, setbooklet] = useState({});
  const [bookletTypes, setbookletTypes] = useState([]);
  const [repetitionTypes, setrepetitionTypes] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [useroptions, setuseroptions] = useState([]);
  const [selectedusers, setselectedusers] = useState([]);
  const [assignBooklet, setassignBooklet] = useState({
    id: '',
    assignedTo: [],
  });
  const tablerow = useRef(null);
  const [count, setcount] = useState(0);
  const [bookletcount, setbookletcount] = useState(0);
  const [usercount, setusercount] = useState(0);
  const history = useHistory();
  const { id } = useParams();
  const [showRepetitions, setShowRepetitions] = useState(0);
  useEffect(() => {
    assignBooklet.id = id;
  }, [assignBooklet, id]);

  useEffect(() => {
    if (bookletcount === 0) {
      fetch(`https://etma-sql.herokuapp.com/api/booklets/GetBooklet/${id}`)
        .then((res) => res.json())
        .then(
          (result) => {
            if (result.data.bookletType._id === '60cb4fde748f06eae36a3788') {
              setShowRepetitions(2);
            } else if (result.data.bookletType._id === '') {
              setShowRepetitions(0);
            } else {
              setShowRepetitions(1);
            }
            setbooklet(result.data);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {}
        );
    }
    setbookletcount(2);
  }, [booklet, id, bookletcount]);

  useEffect(() => {
    if (usercount === 0) {
      fetch(`https://etma-sql.herokuapp.com/api/user/GetAssignableUsers`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '',
          email: '',
          department: '',
          batchNo: '',
        }),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            setuseroptions(result.data);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {}
        );
    }
    setusercount(2);
  }, [useroptions, usercount]);

  useEffect(() => {
    if (bookletTypes.length === 0) {
      fetch(`https://etma-sql.herokuapp.com/api/bookletTypes`)
        .then((res) => res.json())
        .then(
          (result) => {
            setbookletTypes(result.data);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {}
        );
    }
  }, [bookletTypes]);

  useEffect(() => {
    if (count === 0) {
      fetch(
        `https://etma-sql.herokuapp.com/api/booklets/GetAssignedUsersBooklet/${id}`
      )
        .then((res) => res.json())
        .then(
          (result) => {
            setselectedusers(result.data.users);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {}
        );
    }
    setcount(1);
  }, [selectedusers, id, count]);

  useEffect(() => {
    if (repetitionTypes.length === 0) {
      fetch(`https://etma-sql.herokuapp.com/api/repetitions`)
        .then((res) => res.json())
        .then(
          (result) => {
            setrepetitionTypes(result.data);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {}
        );
    }
  }, [repetitionTypes]);

  const checkValue = (value) => {
    let filterdvalue;
    if (value) {
      filterdvalue = selectedusers.filter((item) => value.value === item._id);
    } else {
      filterdvalue = 1;
    }
    return filterdvalue;
  };

  const addUser = (event) => {
    let filterdvalue = checkValue(selectedUser);
    if (filterdvalue.length <= 0) {
      useroptions.forEach((item) => {
        if (item._id === selectedUser.value) {
          setselectedusers((oldArray) => [...oldArray, item]);
        }
      });
    }
  };

  const handleAssign = (e) => {
    e.preventDefault();
    if (selectedusers.length === 0) {
      Swal.fire('Please Assign Users!', '', 'warning');
      return;
    }

    selectedusers.forEach((element) => {
      assignBooklet.assignedTo.push(element._id);
    });

    fetch('https://etma-sql.herokuapp.com/api/booklets/assignBooklet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignBooklet),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.code !== 1) {
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
          Swal.fire({
            title: 'Users Assigned',
            text: '',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ok',
            showCloseButton: false,
          });
          history.push('/assign-booklet');
        }
      });
  };

  const deleteItem = (itemID) => {
    Swal.fire({
      title: 'Are you sure, you want to delete this User?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showCloseButton: true,
      closeButtonHtml: '<img src="/assets/images/Iconmaterial-cancel.svg" />',
    }).then((result) => {
      if (result.isConfirmed) {
        setselectedusers(
          selectedusers.filter((selecteduser) => selecteduser._id !== itemID)
        );
      }
    });
  };

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Assign Booklet</title>
      </Helmet>
      <main className='manage-users-main'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <div className='dashboardheaderbar d-flex justify-content-between align-items-center'>
                <div className='filter-user-top-bar'>
                  <Link to='/assign-booklet'>
                    <h1 className='dashboardtitle create-dashboardtitle'>
                      <div className='arrow-icon-dashboardtitle'>
                        <img src='/assets/images/Back.png' alt='back arrow' />
                      </div>
                      Assign Booklet
                    </h1>
                  </Link>
                </div>
                {/* <div className="btngroup">
                        <Link to="#">
                            <button type="button" className="btn btn-outline-primary dashboardtitle-btn">Publish
                            </button>
                        </Link>
                    </div> */}
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
                      <label htmlFor='form-label'>Booklet ID</label>
                      <input
                        type='number'
                        className='form-control add-form-control'
                        id='bookletid'
                        name='bookletname'
                        placeholder='07'
                        required
                        disabled
                        value={booklet.bookletId}
                        onChange={(event) => {
                          const b = { ...booklet };
                          b.bookletId = event.target.value;
                          setbooklet(b);
                        }}
                      />
                    </div>
                    <div className='form-group col-md-4'>
                      <label htmlFor='inputEmail' className='col-form-label'>
                        Booklet Name
                      </label>
                      <input
                        type='text'
                        className='form-control add-form-control'
                        id='bookletname'
                        name='bookletname'
                        placeholder='Booklet Name'
                        required
                        disabled
                        value={booklet.name}
                        onChange={(event) => {
                          const b = { ...booklet };
                          b.name = event.target.value;
                          setbooklet(b);
                        }}
                      />
                    </div>
                    <div className='form-group col-md-4'>
                      <label htmlFor='inputDept' className='col-form-label'>
                        Booklet Type
                      </label>
                      <select
                        id='booklettype'
                        name='booklettype'
                        disabled
                        onChange={(event) => {
                          const b = { ...booklet };
                          if (
                            event.target.value === '60cb4fde748f06eae36a3788'
                          ) {
                            if (
                              document.querySelectorAll('table thead tr th')
                                .length === 6
                            ) {
                              document
                                .querySelectorAll('table tr th')[4]
                                .remove();
                            }

                            setShowRepetitions(2);
                          } else if (event.target.value === '') {
                            setShowRepetitions(0);
                          } else {
                            if (
                              document.querySelectorAll('table thead tr th')
                                .length === 5
                            ) {
                              var spn = document.createElement('th');
                              spn.textContent = '	QST Repetition';
                              document
                                .querySelectorAll('table thead tr th')[4]
                                .parentNode.insertBefore(
                                  spn,
                                  document.querySelectorAll(
                                    'table thead tr th'
                                  )[4]
                                );
                            }

                            setShowRepetitions(1);
                          }
                          b.bookletType = event.target.value;
                          setbooklet(b);
                        }}
                        className='form-control add-form-control'
                        required
                      >
                        {booklet &&
                        Object.keys(booklet).length !== 0 &&
                        bookletTypes.length !== 0 ? (
                          <>
                            <option value=''>Select Booklet Type</option>
                            {bookletTypes.map((item) => {
                              debugger;
                              return (
                                <option
                                  value={item._id}
                                  key={item._id}
                                  selected={
                                    booklet.bookletType._id === item._id
                                      ? 'selected'
                                      : ''
                                  }
                                >
                                  {item.name}
                                </option>
                              );
                            })}
                          </>
                        ) : (
                          <option>Loading...</option>
                        )}
                      </select>
                    </div>
                    <div className='form-group col-md-4'>
                      <label htmlFor='form-label'>Version</label>
                      <input
                        type='text'
                        className='form-control add-form-control'
                        id='version'
                        name='version'
                        placeholder='1.0.0'
                        required
                        value={booklet.version}
                        disabled
                        onChange={(event) => {
                          const b = { ...booklet };
                          b.version = event.target.value;
                          setbooklet(b);
                        }}
                      />
                    </div>
                  </div>
                  <div className='row form-inner-row'>
                    {/* <div className='form-group col-md-4'>
                    <label htmlFor='form-label'>Created Date</label>
                    <DatePicker
                      selected={booklet.date}
                      
                      showTimeSelect
                      onChange={(date) => {
                        const b = { ...booklet };
                        b.date = date;
                        setbooklet(b);
                      }}
                    />
                  </div> */}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className='row add_row'>
          <div className='col-12'>
            <h3 className='add_title'>Add users</h3>
            <div className='add_card'>
              <div class='row'>
                <div class='col-md-6'>
                  <Select
                    className='basic-multi-select assign_booklet'
                    classNamePrefix='select'
                    onChange={(option) => setSelectedUser(option)}
                    options={
                      useroptions.length === 0
                        ? [
                            {
                              value: '',
                              label: 'Loading...',
                            },
                          ]
                        : useroptions.map(function (item) {
                            return { value: item._id, label: item.name };
                          })
                    }
                  />
                </div>
                <div
                  class='col-md-6'
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <button
                    onClick={addUser}
                    type='button'
                    className='btn btn-outline-primary dashboardtitle-btn add-task-btn'
                  >
                    Add User +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <div className='card card-create-booklet'>
              <div className='card-body table-inner'>
                <table
                  className='data-table data-table-feature'
                  id='data-table-etma'
                >
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>BatchNo</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedusers.map((item, index) => {
                      return (
                        <tr ref={tablerow} id={item._id} key={item._id}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.batchNo}</td>
                          <td>
                            <div className='actionbtns'>
                              <button
                                style={{
                                  padding: '0',
                                  backgroundColor: 'unset',
                                  border: 'unset',
                                }}
                                className='listcardtable__actionbtn'
                                onClick={() => deleteItem(item._id)}
                              >
                                <img
                                  src='/assets/images/delete.svg'
                                  alt='delete data table'
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='form-btns'>
              <button
                onClick={handleAssign}
                type='submit'
                className='btn form-btn btn-outline-primary apply-btn mb-0'
              >
                Assign
              </button>
              <Link to='/assign-booklet'>
                <button
                  type='button'
                  className='btn form-btn btn-primary cancel-btn mb-0'
                >
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default AssignmentEdit;
