import { Link, useParams, useHistory } from 'react-router-dom';
import React, { useEffect, useState, useReducer, useRef } from 'react';
import Loader from '../../Common/Loader';
import Select from 'react-select';
import $ from 'jquery';
import { assign } from 'lodash';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import { CSVReader } from 'react-papaparse';
import 'react-datepicker/dist/react-datepicker.css';
import { Helmet } from 'react-helmet';
function ViewBooklet() {
  const [booklet, setbooklet] = useState({
    name: '',
    bookletType: '',
    version: '',
    isDraft: '',
    id: '',
    // date: null,
    tasks: [],
  });
  const [bookletTypes, setbookletTypes] = useState([]);
  const [categories, setcategories] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [task, settask] = useState([]);
  const [tasks, settasks] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [repetitionTypes, setrepetitionTypes] = useState([]);
  const [assignBooklet, setassignBooklet] = useState({
    id: '',
    assignedTo: [],
  });
  const [loader, setloader] = useState(true);
  const [showRepetitions, setShowRepetitions] = useState(0);
  const tablerow = useRef(null);
  const [count, setcount] = useState(0);
  const [taskcount, settaskcount] = useState(0);
  const [bookletcount, setbookletcount] = useState(0);
  const history = useHistory();
  const [updateView, setUpdateView] = useState(0);
  const { id } = useParams();
  const [usercount2, setusercount2] = useState(0);
  const [useroptions, setuseroptions] = useState([]);
  const buttonRef = React.createRef();
  const [publishedBooklet, setPublishedBooklet] = useState(0);
  const [publishBookletBtn, setPublishBookletBtn] = useState(0);
  const [saveBookletId, setSaveBookletId] = useState('');
  useEffect(() => {
    assignBooklet.id = id;
  }, [assignBooklet, id]);

  useEffect(() => {
    if (taskcount === 0) {
      fetch(`https://etma-sql.herokuapp.com/api/tasks`)
        .then((res) => res.json())
        .then(
          (result) => {
            settask(result.data);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {}
        );
    }
    settaskcount(2);
  }, [task, taskcount]);

  useEffect(() => {
    if (bookletcount === 0) {
     
    }
    setbookletcount(2);
  }, [booklet, bookletcount, id, tasks, history]);

  useEffect(() => {
    if (bookletTypes.length === 0) {
      fetch(`https://etma-sql.herokuapp.com/api/bookletTypes/GetBookletTypes`)
        .then((res) => res.json())
        .then(
          (result) => {
            setbookletTypes(result.data);
            fetch(`https://etma-sql.herokuapp.com/api/booklets/GetBooklet/${id}`)
            .then((res) => res.json())
            .then(
              (innerResult) => {
                setloader(false);
                booklet.name = innerResult.data.name;
                let bookletResult = result.data.filter((item) => {
                  return item.Description === innerResult.data.bookletType;
                });
                booklet.bookletType =
                  bookletResult[0].BookletTypeId.toString();
                booklet.version = innerResult.data.version;
                booklet.isDraft = innerResult.data.isDraft;
                booklet.id = innerResult.data.id;
                settasks(innerResult.data.tasks);
                $('.table').DataTable({
                  ordering: false,
                  dom: 'Bfrtip',
                  buttons: [
                    {
                      extend: 'pdf',
                      footer: true,
                      filename: 'Booklets',
                      title: 'Booklets',
                    },
                    {
                      extend: 'csv',
                      footer: false,
                      filename: 'Booklets',
                      title: 'Booklets',
                    },
                  ],
                  bDestroy: true,
                  language: {
                    lengthMenu: '_MENU_ bản ghi trên trang',
                    search: '<i className="fa fa-search"></i>',
                    searchPlaceholder: 'Search',
                  },
                  initComplete: function (settings, json) {
                    $('.dt-buttons').prepend(
                      "<h4 className='export_title'>Export Booklets:</h4>"
                    );
                    $('.dt-buttons').wrapInner(
                      "<div className='wrapElement'></div>"
                    );
    
                    $('.dt-buttons').append(
                      `<div className="importuserscontainer">
                     
                      </div>`
                    );
                  },
                });
              },
              // Note: it's important to handle errors here
              // instead of a catch() block so that we don't swallow
              // exceptions from actual bugs in components.
              (error) => {}
            );
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {}
        );
    }
  }, [bookletTypes]);

  useEffect(() => {
    if (categories.length === 0) {
      fetch(`https://etma-sql.herokuapp.com/api/categories`)
        .then((res) => res.json())
        .then(
          (result) => {
            setcategories(result.data);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {}
        );
    }
  }, [categories]);

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

  useEffect(() => {
    if (usercount2 === 0) {
      fetch(`https://etma-sql.herokuapp.com/api/user/GetUsers`)
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
    setusercount2(2);
  }, [useroptions, usercount2]);

  const addTask = (event) => {
    if (showRepetitions === 0) {
      Swal.fire({
        title: 'Select Category Type First',
        text: '',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'ok',
        showCloseButton: false,
      });
      return;
    }

    if (
      showRepetitions === 1 &&
      document.querySelectorAll('table tr th').length === 6
    ) {
      const item = {
        srno: '',
        name: '',
        category: '',
        qtRepetition: '',
        qstRepetition: '',
      };
      settasks((oldArray) => [...oldArray, item]);
      return;
    }

    if (
      showRepetitions === 2 &&
      document.querySelectorAll('table tr th').length === 6
    ) {
      Swal.fire({
        title: 'Please Change Category Type',
        text: '',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'ok',
        showCloseButton: false,
      });
      return;
    } else if (
      showRepetitions === 2 &&
      document.querySelectorAll('table tr th').length === 5
    ) {
      const item = {
        srno: '',
        name: '',
        category: '',
        qtRepetition: '',
      };
      settasks((oldArray) => [...oldArray, item]);
      return;
    }
  };

  $(window).keydown(function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      return false;
    }
  });

  const handleAssign = (e) => {
    e.preventDefault();
    console.log(e);

    var $btn = $(document.activeElement);

    if (tasks.length === 0) {
      Swal.fire('Please Add Tasks!', '', 'warning');
      return;
    }
    booklet.tasks = [];

    if (showRepetitions === 2) {
      tasks.forEach((element) => {
        booklet.tasks.push({
          name: element.name,
          category: element.category,
          qstRepetition: 0,
          qtRepetition: element.qtRepetition,
          // userId: element.userid,
        });
      });
    }

    if (showRepetitions === 1) {
      tasks.forEach((element) => {
        booklet.tasks.push({
          name: element.name,
          category: element.category,
          qstRepetition: element.qstRepetition,
          qtRepetition: element.qtRepetition,
          // userId: element.userid,
        });
      });
    }
    debugger;
    if ($btn[0].id === 'savebtn') {
      booklet.isDraft = 'true';
      fetch('https://etma-sql.herokuapp.com/api/booklets/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(booklet),
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
              title: 'Booklet Saved',
              text: '',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'ok',
              showCloseButton: false,
            });
          }
        });
    } else if ($btn[0].id === 'publishbtn') {
      booklet.isDraft = 'false';
      fetch('https://etma-sql.herokuapp.com/api/booklets/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(booklet),
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
              title: 'Booklet Published',
              text: '',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'ok',
              showCloseButton: false,
            });
            history.push('/booklets');
          }
        });
    }
  };
  const deleteItem = (e, itemID) => {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure, you want to delete this Task?',
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
        settasks(tasks.filter((task) => task.srno !== itemID));
      }
    });
  };

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnFileLoad = (data) => {
    if (showRepetitions === 0) {
      Swal.fire('Select Category Type First', '', 'warning');
      return;
    }

    for (var i = 1; i < data.length; i++) {
      let newObject = {
        name: '',
        category: '',
        qtRepetition: 0,
        qstRepetition: 0,
      };
      if (data[i].data[0] !== '') {
        for (let y = 0; y < data[0].data.length; y++) {
          if (data[0].data[y].trim().toLowerCase() === 'task name') {
            newObject.name = data[i].data[y];
          }
          if (data[0].data[y].trim().toLowerCase() === 'category') {
            newObject.category = data[i].data[y];
          }
          if (data[0].data[y].trim().toLowerCase() === 'qt-repetition') {
            newObject.qtRepetition = parseInt(data[i].data[y]);
          }
          if (data[0].data[y].trim().toLowerCase() === 'qst-repetition') {
            newObject.qstRepetition = parseInt(data[i].data[y]);
          }
        }
      }
      debugger;
      settasks((oldArray) => [...oldArray, newObject]);
    }
  };
  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    console.log('---------------------------');
    console.log(data);
    console.log('---------------------------');
  };

  const handleRemoveFile = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  const showNotPublishedModal = () => {};

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>View Booklet</title>
      </Helmet>
      {booklet.isEditable === 'false' ? (
        <Loader />
      ) : (
        <main className='manage-users-main'>
          <form className='add-new ' onSubmit={handleAssign}>
            <div className='container-fluid'>
              <div className='row'>
                <div className='col-12'>
                  <div className='dashboardheaderbar d-flex justify-content-between align-items-center'>
                    <div className='filter-user-top-bar'>
                      <Link to='/booklets'>
                        <h1 className='dashboardtitle create-dashboardtitle'>
                          <div className='arrow-icon-dashboardtitle'>
                            <img
                              src='/assets/images/Back.png'
                              alt='back arrow'
                            />
                          </div>
                          View Booklet
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
                  <div className='form-2'>
                    <div className='row form-inner-row'>
                      {/* <div className='form-group name-field col-md-4'>
                      <label htmlFor='form-label'>Booklet ID</label>
                      <input
                        type='number'
                        className='form-control add-form-control'
                        id='bookletid'
                        name='bookletid'
                        placeholder='07'
                        required
                        value={booklet.bookletId}
                        onChange={(event) => {
                          const b = { ...booklet };
                          b.bookletId = parseInt(event.target.value);
                          setbooklet(b);
                        }}
                      />
                    </div> */}
                      <div className='form-group col-md-4'>
                        <label htmlFor='inputEmail' className='col-form-label'>
                          Booklet Name
                        </label>
                        <input
                          type='text'
                          disabled
                          className='form-control add-form-control'
                          id='bookletname'
                          name='bookletname'
                          placeholder='Booklet Name'
                          required
                          value={booklet.name}
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
                          className='form-control add-form-control'
                          required
                        >
                          {bookletTypes ? (
                            <>
                              <option value=''>Select Booklet Type</option>
                              {bookletTypes.map((item) => {
                                return (
                                  <option
                                    value={item.BookletTypeId}
                                    key={item.BookletTypeId}
                                    selected={
                                      booklet.bookletType == item.BookletTypeId
                                        ? 'selected'
                                        : ''
                                    }
                                  >
                                    {item.Description}
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
                          disabled
                          name='version'
                          placeholder='1.0.0'
                          required
                          value={booklet.version}
                        />
                      </div>
                      {/* <div className='form-group col-md-4'>
                      <label htmlFor='inputDept' className='col-form-label'>
                        Booklet Type
                      </label>
                      <select
                        id='booklettype'
                        name='booklettype'
                        onChange={(event) => {
                          const b = { ...booklet };
                          b.bookletType._id = event.target.value;
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
                    </div>*/}
                    </div>

                    <div className='row form-inner-row'>
                      {/* {showRepetitions === 1 ? (
                      <>
                        <div className='form-group col-md-4'>
                          <label htmlFor='form-label'>QT</label>
                          <select
                            id='bookletrepetition'
                            disabled
                            name='bookletrepetition'
                            className='form-control add-form-control'
                            required
                          >
                            <option>QT</option>
                          </select>
                        </div>
                        <div className='form-group col-md-4'>
                          <label htmlFor='form-label'>QST</label>
                          <select
                            id='bookletrepetition'
                            disabled
                            name='bookletrepetition'
                            className='form-control add-form-control'
                            required
                          >
                            <option>QST</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <div></div>
                    )}
                    {showRepetitions === 2 ? (
                      <>
                        <div className='form-group col-md-4'>
                          <label htmlFor='form-label'>QT</label>
                          <select
                            id='bookletrepetition'
                            disabled
                            name='bookletrepetition'
                            className='form-control add-form-control'
                            required
                          >
                            <option>QT</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <div></div>
                    )} */}
                      {/* <div className='form-group col-md-4'>
                      <label htmlFor='form-label'> Repetition Type</label>
                      <select
                        id='bookletrepetition'
                        name='bookletrepetition'
                        className='form-control add-form-control'
                        required
                        onChange={(event) => {
                          const b = { ...booklet };
                          b.repetitionType._id = event.target.value;
                          setbooklet(b);
                        }}
                      >
                        {booklet &&
                        Object.keys(booklet).length !== 0 &&
                        repetitionTypes.length !== 0 ? (
                          <>
                            <option value=''>Select Repetition Type</option>
                            {repetitionTypes.map((item) => {
                              return (
                                <option
                                  value={item._id}
                                  key={item._id}
                                  selected={
                                    booklet.repetitionType._id === item._id
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
                    </div> */}
                      {/* <div className='form-group col-md-4'>
                    <label htmlFor='form-label'>Created Date</label>
                    <DatePicker
                      selected={booklet.date}
                      className='form-control'
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
                </div>
              </div>
            </div>

            <div className='row mb-4'>
              <div className='col-12 mb-4'>
                <div className='card'>
                  <div className='card-body table-inner'>
                    {loader ? (
                      <Loader />
                    ) : (
                      <table className='table'>
                        <thead>
                          <tr>
                            <th>Sr No</th>
                            <th>Task Name</th>
                            <th>Category</th>
                            {/* <th>Created Date</th>
                        <th>Published Date</th> */}
                            <th> QT-Repetition</th>
                            <th> QST-Repetition</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.map((item, index) => {
                            return (
                              <tr id={item.id} key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                {/* <td>{new Date(item.date).toLocaleString()}</td>
                            <td>
                              {new Date(item.publishedDate).toLocaleString()}
                            </td> */}
                                <td>{item.qtRepetition}</td>
                                <td>{item.qstRepetition}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      )}
    </>
  );
}

export default ViewBooklet;
