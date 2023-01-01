import { Link, useParams, useHistory } from 'react-router-dom';
import React, { useEffect, useState, useReducer, useRef } from 'react';
import { CSVReader } from 'react-papaparse';
import Loader from '../../Common/Loader';
import Select from 'react-select';
import $ from 'jquery';
import { assign } from 'lodash';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Helmet } from 'react-helmet';
import LoaderButton from '../../Common/LoaderButton';
function Add() {
  const [booklet, setbooklet] = useState({
    name: null,
    bookletType: null,
    version: null,
    isDraft: true,
    // date: null,
    createdBy: '1',
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
  const [useroptions, setuseroptions] = useState([]);
  const [btnLock, setBtnLock] = useState(false);
  const [assignBooklet, setassignBooklet] = useState({
    id: '',
    assignedTo: [],
  });
  const [missingColumns, setMissingColumns, getMissingColumns] = useState([]);
  const tablerow = useRef(null);
  const [count, setcount] = useState(0);
  const [bookletcount, setbookletcount] = useState(0);
  const [usercount, setusercount] = useState(0);
  const history = useHistory();
  const [updateView, setUpdateView] = useState(0);
  const { id } = useParams();
  const [usercount2, setusercount2] = useState(0);
  const buttonRef = React.createRef();
  const [showRepetitions, setShowRepetitions] = useState(0);
  const [publishedBooklet, setPublishedBooklet] = useState(0);
  const [publishBookletBtn, setPublishBookletBtn] = useState(0);
  const [saveBookletId, setSaveBookletId] = useState('');
  useEffect(() => {
    assignBooklet.id = id;
  }, [assignBooklet, id]);

  useEffect(() => {
    if (usercount === 0) {
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
    setusercount(2);
  }, [task, usercount]);

  useEffect(() => {
    if (bookletTypes.length === 0) {
      fetch(`https://etma-sql.herokuapp.com/api/bookletTypes/GetBookletTypes`)
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

  useEffect(() => {}, [missingColumns]);
  const checkValue = (value) => {
    let filterdvalue;
    if (value) {
      filterdvalue = tasks.filter((item) => value.value === item._id);
    } else {
      filterdvalue = 1;
    }
    return filterdvalue;
  };

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
    debugger;

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
          qtRepetition: parseInt(element.qtrepetition),
          // userId: element.userid,
        });
      });
    }

    if (showRepetitions === 1) {
      tasks.forEach((element) => {
        booklet.tasks.push({
          name: element.name,
          category: element.category,
          qstRepetition: parseInt(element.qstrepetition),
          qtRepetition: parseInt(element.qtrepetition),
          // userId: element.userid,
        });
      });
    }

    setBtnLock(true);
    if ($btn[0].id === 'savebtn' && saveBookletId === '') {
      booklet.isDraft = true;
      fetch('https://etma-sql.herokuapp.com/api/booklets/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(booklet),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
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
            setSaveBookletId(data.data.bookletId);
            history.push('/booklets');
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
    } else if ($btn[0].id === 'publishbtn' && saveBookletId === '') {
      booklet.isDraft = false;
      fetch('https://etma-sql.herokuapp.com/api/booklets/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(booklet),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
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

      return;
    }
    if ($btn[0].id === 'savebtn' && saveBookletId !== '') {
      booklet.isDraft = true;
      booklet.id = saveBookletId;
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
            history.push('/booklets');
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
    } else if ($btn[0].id === 'publishbtn' && saveBookletId !== '') {
      booklet.isDraft = false;
      booklet.id = saveBookletId;
      fetch('https://etma-sql.herokuapp.com/api/booklets/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(booklet),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          setBtnLock(false);
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
            setBtnLock(false);
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
        settasks(tasks.filter((task) => task.uniqueId !== itemID));
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
    if (showRepetitions === 2) processArrayWithSetTimeout2(data);

    if (showRepetitions === 1) processArrayWithSetTimeout(data);
  };
  var currentIndex;

  function processNthElement(array) {
    let taskNameIndex = null;
    let CategoryIndex = null;
    let qtRepetionIndex = null;
    let qstRepetionIndex = null;

    for (let y = 0; y < array[0].data.length; y++) {
      if (array[0].data[y].trim().toLowerCase() === 'task name') {
        taskNameIndex = y;
      }
      if (array[0].data[y].trim().toLowerCase() === 'category') {
        CategoryIndex = y;
      }
      if (array[0].data[y].trim().toLowerCase() === 'qt-repetition') {
        qtRepetionIndex = y;
      }
      if (array[0].data[y].trim().toLowerCase() === 'qst-repetition') {
        qstRepetionIndex = y;
      }
    }
    if (currentIndex >= array.length) {
      const messageArray = [];
      if (taskNameIndex === null) {
        messageArray.push('Task Name');
      }

      if (CategoryIndex === null) {
        messageArray.push('Category');
      }

      if (qtRepetionIndex === null) {
        messageArray.push('Qt-Repetition');
      }

      if (qstRepetionIndex === null) {
        messageArray.push('Qst-Repetition');
      }

      if (
        taskNameIndex === null ||
        CategoryIndex === null ||
        qtRepetionIndex === null ||
        qstRepetionIndex === null
      ) {
        let message = '';
        for (let i = 0; i < messageArray.length; i++) {
          message += messageArray[i] + ', ';
        }

        message += ' columns are missing from the file';
        Swal.fire(message, '', 'warning');
      }
      return;
    }

    let newObject = {
      name: '',
      category: '',
      qtrepetition: 0,
      qstrepetition: 0,
      uniqueId: new Date().valueOf(),
    };

    if (
      taskNameIndex !== null &&
      CategoryIndex !== null &&
      qtRepetionIndex !== null &&
      qstRepetionIndex !== null
    ) {
      //do what you want with the array element here
      newObject.name = array[currentIndex].data[taskNameIndex];
      newObject.category = array[currentIndex].data[CategoryIndex];
      newObject.qtrepetition = array[currentIndex].data[qtRepetionIndex];
      newObject.qstrepetition = array[currentIndex].data[qstRepetionIndex];

      settasks((oldArray) => [...oldArray, newObject]);
    }
    array[currentIndex]++;

    currentIndex++;

    setTimeout(function () {
      processNthElement(array);
    }, 1);
  }
  function processArrayWithSetTimeout(array) {
    currentIndex = 1;
    processNthElement(array);
  }

  var currentIndex2;

  function processNthElement2(array) {
    let taskNameIndex = null;
    let CategoryIndex = null;
    let qtRepetionIndex = null;

    for (let y = 0; y < array[0].data.length; y++) {
      if (array[0].data[y].trim().toLowerCase() === 'task name') {
        taskNameIndex = y;
      }
      if (array[0].data[y].trim().toLowerCase() === 'category') {
        CategoryIndex = y;
      }
      if (array[0].data[y].trim().toLowerCase() === 'qt-repetition') {
        qtRepetionIndex = y;
      }
    }
    if (currentIndex2 >= array.length) {
      const messageArray = [];
      if (taskNameIndex === null) {
        messageArray.push('Task Name');
      }

      if (CategoryIndex === null) {
        messageArray.push('Category');
      }

      if (qtRepetionIndex === null) {
        messageArray.push('Qt-Repetition');
      }

      if (
        taskNameIndex === null ||
        CategoryIndex === null ||
        qtRepetionIndex === null
      ) {
        let message = '';
        for (let i = 0; i < messageArray.length; i++) {
          message += messageArray[i] + ', ';
        }

        message += ' columns are missing from the file';
        Swal.fire(message, '', 'warning');
      }
      return;
    }

    let newObject = {
      name: '',
      category: '',
      qtrepetition: 0,
      qstrepetition: 0,
      uniqueId: new Date().valueOf(),
    };

    if (
      taskNameIndex !== null &&
      CategoryIndex !== null &&
      qtRepetionIndex !== null
    ) {
      //do what you want with the array element here
      newObject.name = array[currentIndex2].data[taskNameIndex];
      newObject.category = array[currentIndex2].data[CategoryIndex];
      newObject.qtrepetition = array[currentIndex2].data[qtRepetionIndex];

      settasks((oldArray) => [...oldArray, newObject]);
    }
    array[currentIndex2]++;

    currentIndex2++;

    setTimeout(function () {
      processNthElement2(array);
    }, 1);
  }
  function processArrayWithSetTimeout2(array) {
    currentIndex2 = 1;
    processNthElement2(array);
  }

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
        <title>Add Booklet</title>
      </Helmet>
      <main className='manage-users-main'>
        <form className='add-new' onSubmit={handleAssign}>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-12'>
                <div className='dashboardheaderbar d-flex justify-content-between align-items-center'>
                  <div className='filter-user-top-bar'>
                    <Link to='/booklets'>
                      <h1 className='dashboardtitle create-dashboardtitle'>
                        <div className='arrow-icon-dashboardtitle'>
                          <img src='/assets/images/Back.png' alt='back arrow' />
                        </div>
                        Create Booklet
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
                        className='form-control add-form-control'
                        id='bookletname'
                        name='bookletname'
                        placeholder='Booklet Name'
                        required
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
                        onChange={(event) => {
                          const b = { ...booklet };
                          if (event.target.value === '4') {
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
                        {bookletTypes.length === 0 ? (
                          <option>Loading...</option>
                        ) : (
                          <>
                            <option value=''>Select Booklet Type</option>
                            {bookletTypes.map((item) => {
                              return (
                                <option
                                  value={item.BookletTypeId}
                                  key={item.BookletTypeId}
                                  selected={
                                    booklet.bookletType === item.BookletTypeId
                                      ? 'selected'
                                      : ''
                                  }
                                >
                                  {item.Description}
                                </option>
                              );
                            })}
                          </>
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
                      <label htmlFor='form-label'>QT/ QST</label>
                      <select
                        id='bookletrepetition'
                        name='bookletrepetition'
                        className='form-control add-form-control'
                        required
                        onChange={(event) => {
                          const b = { ...booklet };
                          b.repetitionType = event.target.value;
                          setbooklet(b);
                        }}
                      >
                        {repetitionTypes.length === 0 ? (
                          <option>Loading...</option>
                        ) : (
                          <>
                            <option value=''>Select Repetition Type</option>
                            {repetitionTypes.map((item) => {
                              return (
                                <option
                                  value={item._id}
                                  key={item._id}
                                  selected={
                                    booklet.repetitionType === item._id
                                      ? 'selected'
                                      : ''
                                  }
                                >
                                  {item.name}
                                </option>
                              );
                            })}
                          </>
                        )}
                      </select>
                    </div> */}
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

          <div className='row' style={{ marginTop: '40px' }}>
            <div className='col-12'>
              <div className='card card-create-booklet'>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ marginLeft: '30px' }} class='importcontainer'>
                    <CSVReader
                      ref={buttonRef}
                      onFileLoad={handleOnFileLoad}
                      onError={handleOnError}
                      noClick
                      accept='.csv'
                      noDrag
                      onRemoveFile={handleOnRemoveFile}
                    >
                      {({ file }) => (
                        <button
                          type='button'
                          onClick={handleOpenDialog}
                          style={{
                            borderRadius: 0,
                            marginLeft: 0,
                            marginRight: 0,
                            width: '40%',
                            paddingLeft: 0,
                            paddingRight: 0,
                          }}
                        >
                          Import File
                        </button>
                      )}
                    </CSVReader>
                  </div>
                  <button
                    onClick={addTask}
                    type='button'
                    className='btn btn-outline-primary dashboardtitle-btn add-task-btn'
                  >
                    Add Task +
                  </button>
                </div>
                <div className='card-body table-inner'>
                  <table
                    className='data-table data-table-feature'
                    id='data-table-etma'
                  >
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Task Name</th>
                        {/* <th>Users</th> */}
                        <th>Category</th>
                        <th>QT-Repetition</th>
                        <th>QST-Repetition</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((item, index) => {
                        return (
                          <tr id={item.uniqueId}>
                            <td>{(tasks[index].srno = index + 1)} </td>

                            <td>
                              <input
                                type='text'
                                value={tasks[index].name}
                                onChange={(event) => {
                                  let newArr = [...tasks]; // copying the old datas array
                                  newArr[index].name = event.target.value; // replace e.target.value with whatever you want to change it to

                                  settasks(newArr); // ??
                                }}
                                className='form-control'
                                id={'taskname' + (index + 1)}
                                name={'taskname' + (index + 1)}
                                placeholder='Enter Task Name'
                                required
                              />{' '}
                            </td>
                            {/* <td>
                              {' '}
                              <select
                                id={'usersselect' + (index + 1)}
                                name={'usersselect' + (index + 1)}
                                className='form-control add-form-control'
                                required
                                onChange={(event) => {
                                  let newArr = [...tasks]; // copying the old datas array
                                  newArr[index].userid = event.target.value; // replace e.target.value with whatever you want to change it to

                                  settasks(newArr); // ??
                                }}
                              >
                                {useroptions.length === 0 ? (
                                  <option>Loading...</option>
                                ) : (
                                  <>
                                    <option value=''>Please Select User</option>
                                    {useroptions.map((useritem) => {
                                      return (
                                        <option
                                          value={useritem._id}
                                          key={useritem._id}
                                        >
                                          {useritem.name}
                                        </option>
                                      );
                                    })}
                                  </>
                                )}
                              </select>
                            </td>*/}
                            <td>
                              <input
                                type='text'
                                value={tasks[index].category}
                                onChange={(event) => {
                                  let newArr = [...tasks]; // copying the old datas array
                                  newArr[index].category = event.target.value; // replace e.target.value with whatever you want to change it to

                                  settasks(newArr); // ??
                                }}
                                className='form-control'
                                id={'category' + (index + 1)}
                                name={'category' + (index + 1)}
                                placeholder='Enter Category'
                                required
                              />{' '}
                            </td>
                            {/* <td>
                              {' '}
                              <select
                                id={'bookletrepetition' + (index + 1)}
                                name={'bookletrepetition' + (index + 1)}
                                className='form-control add-form-control'
                                required
                                onChange={(event) => {
                                  let newArr = [...tasks]; // copying the old datas array
                                  newArr[index].category = event.target.value; // replace e.target.value with whatever you want to change it to

                                  settasks(newArr); // ??
                                }}
                              >
                                {categories.length === 0 ? (
                                  <option>Loading...</option>
                                ) : (
                                  <>
                                    <option value=''>
                                      Please select Category
                                    </option>
                                    {categories.map((category) => {
                                      return (
                                        <option
                                          value={category._id}
                                          key={category._id}
                                        >
                                          {category.name}
                                        </option>
                                      );
                                    })}
                                  </>
                                )}
                              </select>
                            </td> */}
                            <td>
                              {' '}
                              <input
                                type='number'
                                value={tasks[index].qtrepetition}
                                onChange={(event) => {
                                  let newArr = [...tasks]; // copying the old datas array
                                  newArr[index].qtrepetition = parseInt(
                                    event.target.value
                                  ); // replace e.target.value with whatever you want to change it to

                                  settasks(newArr); // ??
                                }}
                                className='form-control'
                                id={'qtrepetition' + (index + 1)}
                                name={'qtrepetition' + (index + 1)}
                                placeholder='Enter qtrepetition'
                                required
                              />{' '}
                            </td>
                            {showRepetitions === 1 ? (
                              <td>
                                <input
                                  type='number'
                                  value={tasks[index].qstrepetition}
                                  onChange={(event) => {
                                    let newArr = [...tasks]; // copying the old datas array
                                    newArr[index].qstrepetition = parseInt(
                                      event.target.value
                                    ); // replace e.target.value with whatever you want to change it to

                                    settasks(newArr); // ??
                                  }}
                                  className='form-control'
                                  id={'qstrepetition' + (index + 1)}
                                  name={'qstrepetition' + (index + 1)}
                                  placeholder='Enter qstrepetition'
                                  required
                                />{' '}
                              </td>
                            ) : (
                              ''
                            )}
                            <td>
                              <div className='actionbtns'>
                                <a
                                  href='#'
                                  style={{
                                    padding: '0',
                                    backgroundColor: 'unset',
                                    border: 'unset',
                                    marginLeft: '-8px',
                                  }}
                                  className='listcardtable__actionbtn'
                                  onClick={(e) => deleteItem(e, item.uniqueId)}
                                >
                                  <img
                                    src='/assets/images/delete.svg'
                                    alt='delete data table'
                                  />
                                </a>
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
                  disabled={btnLock}
                  type='submit'
                  id='publishbtn'
                  className='btn form-btn btn-outline-primary apply-btn mb-0'
                >
                  Publish
                  {btnLock ? <div class='btnloader'>{LoaderButton}</div> : ''}
                </button>
                <button
                  disabled={btnLock}
                  type='submit'
                  id='savebtn'
                  className='btn form-btn btn-outline-primary apply-btn mb-0'
                >
                  Save
                  {btnLock ? <div class='btnloader'>{LoaderButton}</div> : ''}
                </button>

                <Link to='/booklets'>
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
        </form>
      </main>
    </>
  );
}

export default Add;
