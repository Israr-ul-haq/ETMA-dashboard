import { Link, useHistory } from 'react-router-dom';
import { v4 as uuidv4, parse } from 'uuid';
import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import { CSVReader } from 'react-papaparse';
import LoaderButton from '../../Common/LoaderButton';

const UploadUsers = () => {
  const [items, setItems] = useState([]);
  const history = useHistory();
  const buttonRef = React.createRef();
  const [departments, setdepartments] = useState([]);
  const [importDisable, setImportDisable] = useState(0);
  const [error, setError] = useState(null);
  const [admins, setadmins] = useState([]);
  const [btnLock, setBtnLock] = useState(false);

  const [roleerror, setroleerror] = useState(null);
  const [roles, setroles] = useState([]);
  const [finaluser, setfinaluser] = useState([]);
  const [users, setUsers] = useState([]);
  const [userscount, setusercount] = useState(0);
  function deleteItem(id) {
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
        fetch(`https://etma-sql.herokuapp.com/api/user/DeleteUser/${id}`, {
          method: 'POST',
        })
          .then((res) => res.json())
          .then(
            (result) => {
              setItems(
                items.filter((selecteditem) => selecteditem.uniqueId !== id)
              );
            },
            (error) => {}
          );
      }
    });

    //}
  }
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4()
    );
  }
  useEffect(() => {
    fetch(`https://etma-sql.herokuapp.com/api/admins/GetAdmins`)
      .then((res) => res.json())
      .then(
        (result) => {
          setadmins(result.data);
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
    fetch(`https://etma-sql.herokuapp.com/api/roles/GetRoles`)
      .then((res) => res.json())
      .then(
        (result) => {
          setroles(result.data);
          setImportDisable(1);
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
    fetch(`https://etma-sql.herokuapp.com/api/departments/GetDepartments`)
      .then((res) => res.json())
      .then(
        (result) => {
          setdepartments(result.data);
          setImportDisable(1);
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
    setfinaluser([]);
    debugger;

    items.forEach((item) => {
      let finalRoles = [];
      if (item.userRole.length === 0) {
        finalRoles.push({
          roleId: 1,
        });
      } else {
        item.userRole.forEach((inneritem) => {
          finalRoles.push({
            roleId: inneritem.RoleId,
          });
        });
      }

      if (item.admin.AdminId === 0) {
        item.admin.AdminId = 3;
      }
      // if (
      //   item.name === '' ||
      //   item.email === '' ||
      //   item.departments.DepartmentId === 0 ||
      //   item.batchNo === '' ||
      //   roles.length === 0
      // ) {
      //   Swal.fire({
      //     title: 'Incorrect Data',
      //     text: '',
      //     icon: 'error',
      //     showCancelButton: false,
      //     confirmButtonColor: '#3085d6',
      //     confirmButtonText: 'ok',
      //     showCloseButton: false,
      //   });
      //   return;
      // }
      finaluser.push({
        name: item.name,
        email: item.email,
        departmentId: item.departments.DepartmentId,
        batchNo: item.batchNo,
        userRole: finalRoles,
        adminId: item.admin.AdminId,
      });
    });
    setBtnLock(true);
    fetch('https://etma-sql.herokuapp.com/api/user/ImportUsers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finaluser),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        debugger;

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
            title: 'Users Imported',
            text: '',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ok',
            showCloseButton: false,
          });
          history.push('/users');
        }
      });
  };
  const checkfile = (sender) => {
    var validExts = new Array('.xlsx', '.xls', '.csv');
    var fileExt = sender.value;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      alert(
        'Invalid file selected, valid files are of ' +
          validExts.toString() +
          ' types.'
      );
      return false;
    } else return true;
  };

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  useEffect(() => {
    if (userscount === 0) {
      fetch('https://etma-sql.herokuapp.com/api/user/GetAllUsers')
        .then((res) => res.json())
        .then(
          (result) => {
            setUsers(result.data);
          },
          (error) => {}
        );
    }
  }, [userscount]);

  const handleOnFileLoad = (data) => {
    setItems([]);
    processArrayWithSetTimeout(data);
  };
  var currentIndex;
  let emailAlreadyPresent = [];

  function processNthElement(array) {
    let userNameIndex = null;
    let employeeIndex = 0;
    let emailIndex = null;
    let batchNoIndex = null;
    let departmentIndex = null;
    let adminIndex = null;
    let rolesIndex = null;

    for (let y = 0; y < array[0].data.length; y++) {
      if (array[0].data[y].trim().toLowerCase() === 'user name') {
        userNameIndex = y;
      }

      if (array[0].data[y].trim().toLowerCase() === 'email') {
        emailIndex = y;
      }
      if (array[0].data[y].trim().toLowerCase() === 'batchno') {
        batchNoIndex = y;
      }
      if (array[0].data[y].trim().toLowerCase() === 'department') {
        departmentIndex = y;
      }
      if (array[0].data[y].trim().toLowerCase() === 'admin') {
        adminIndex = y;
      }
      if (array[0].data[y].trim().toLowerCase() === 'roles') {
        rolesIndex = y;
      }
    }
    if (currentIndex >= array.length) {
      const messageArray = [];
      if (userNameIndex === null) {
        messageArray.push('User Name');
      }

      if (emailIndex === null) {
        messageArray.push('Email');
      }

      if (batchNoIndex === null) {
        messageArray.push('Batch No');
      }
      if (departmentIndex === null) {
        messageArray.push('Department');
      }
      if (adminIndex === null) {
        messageArray.push('Admin');
      }
      if (rolesIndex === null) {
        messageArray.push('Roles');
      }

      if (
        userNameIndex === null ||
        emailIndex === null ||
        batchNoIndex === null ||
        departmentIndex === null ||
        adminIndex === null ||
        rolesIndex === null
      ) {
        let message = '';
        for (let i = 0; i < messageArray.length; i++) {
          message += messageArray[i] + ', ';
        }

        message += ' columns are missing from the file';
        Swal.fire(message, '', 'warning');
        return;
      }

      if (emailAlreadyPresent.length !== 0) {
        let emailMessage =
          'Unable to import, the following  emails already exists:\n';
        for (let i = 0; i < emailAlreadyPresent.length; i++) {
          emailMessage += emailAlreadyPresent[i] + '\n';
        }

        Swal.fire({
          title: emailMessage,
          text: '',
          icon: 'warning',
          confirmButtonText: 'Ok',
          showCloseButton: true,
          customClass: {
            container: 'importuserspopup',
          },
        });
        return;
      }
    }

    let rolesNew = [];
    let newDepartment = {};
    let newAdmin = {};
    let finalRoles = [];
    let isEmployeeId = false;
    let newObject = {
      name: '',
      email: '',
      departmentId: 0,
      admin: {
        AdminId: 0,
        Description: '',
      },
      batchNo: '',
      userRole: finalRoles,
      uniqueId: new Date().valueOf(),
    };
    if (
      userNameIndex !== null &&
      emailIndex !== null &&
      batchNoIndex !== null &&
      departmentIndex !== null &&
      adminIndex !== null &&
      rolesIndex !== null
    ) {
      //do what you want with the array element here
      if (
        !users.some((item) => {
          return item.Email === array[currentIndex].data[emailIndex];
        })
      ) {
        if (array[currentIndex].data[departmentIndex]) {
          // eslint-disable-next-line no-loop-func
          departments.forEach((item) => {
            if (
              item.Description.trim().toLowerCase() ===
              array[currentIndex].data[departmentIndex].trim().toLowerCase()
            ) {
              newDepartment = item;
            }
          });

          newObject.departments = newDepartment;
        } else {
          newObject.departments = {
            DepartmentId: 0,
            Description: '',
          };
        }
        if (array[currentIndex].data[rolesIndex]) {
          rolesNew = array[currentIndex].data[rolesIndex].split(',');
          // eslint-disable-next-line no-loop-func
          roles.forEach((item) => {
            rolesNew.forEach((roleItem) => {
              if (
                item.Description.trim().toLowerCase() ===
                roleItem.trim().toLowerCase()
              ) {
                finalRoles.push(item);
              }
            });
          });
          newObject.userRole = finalRoles;
        }

        if (array[currentIndex].data[adminIndex]) {
          debugger;
          // eslint-disable-next-line no-loop-func
          admins.forEach((item) => {
            if (
              item.Description.trim().toLowerCase() ===
              array[currentIndex].data[adminIndex].trim().toLowerCase()
            ) {
              newAdmin = item;
            }
          });

          newObject.admin = newAdmin;
        }
        newObject.name = array[currentIndex].data[userNameIndex];
        newObject.email = array[currentIndex].data[emailIndex];
        newObject.batchNo = array[currentIndex].data[batchNoIndex];

        setItems((oldArray) => [...oldArray, newObject]);
      } else {
        emailAlreadyPresent.push(array[currentIndex].data[emailIndex]);
      }
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

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
    console.log(file);
    console.log(inputElem);
    console.log(reason);
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
        <title>Upload Users</title>
      </Helmet>
      <main className='manage-users-main'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <div className='dashboardheaderbar d-flex justify-content-between align-items-center'>
                <div className='filter-user-top-bar'>
                  <Link to='/users'>
                    <h1 className='dashboardtitle create-dashboardtitle'>
                      <div className='arrow-icon-dashboardtitle'>
                        <img alt='backarraow' src='/assets/images/Back.png' />
                      </div>
                      Upload Users
                    </h1>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-12'>
              <div className='card card-create-booklet'>
                <div className='card-body table-inner'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div class='importcontainer importcontaineruser'>
                      <CSVReader
                        ref={buttonRef}
                        onFileLoad={handleOnFileLoad}
                        onError={handleOnError}
                        noClick
                        accept='.csv, text/csv'
                        noDrag
                        strict='true'
                        onRemoveFile={handleOnRemoveFile}
                      >
                        {({ file }) => (
                          <button
                            disabled={importDisable ? '' : 'disabled'}
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
                  </div>
                  <table
                    className='data-table data-table-feature users'
                    id='data-table-etma'
                  >
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th hidden>Employee Id</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>BatchNo</th>
                        <th>Roles</th>
                        <th>Admin</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => {
                        return (
                          <tr id={item.uniqueId} key={item.admin}>
                            <td>{index + 1}</td>
                            <td hidden>{item.uniqueId}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.departments.Description} </td>
                            <td>{item.batchNo}</td>
                            <td>
                              {item.userRole.length === 0
                                ? 'User'
                                : item.userRole.map((x, index, array) => {
                                    //return (index === array.length -1 ? x.name : x.name
                                    if (index === array.length - 1) {
                                      return x.Description;
                                    } else {
                                      return x.Description + ', ';
                                    }
                                  })}
                            </td>
                            <td>
                              {item.admin.Description === ''
                                ? 'None'
                                : item.admin.Description}
                            </td>
                            <td>
                              <div className='actionbtns'>
                                <button
                                  style={{
                                    padding: '0',
                                    backgroundColor: 'unset',
                                    border: 'unset',
                                  }}
                                  className='listcardtable__actionbtn'
                                  onClick={() => deleteItem(item.uniqueId)}
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
                  disabled={btnLock}
                  onClick={handleAssign}
                  type='submit'
                  className='btn form-btn btn-outline-primary apply-btn mb-0'
                >
                  Save
                  {btnLock ? <div class='btnloader'>{LoaderButton}</div> : ''}
                </button>
                <Link to='/users'>
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
        </div>
      </main>
    </>
  );
};

export default UploadUsers;
