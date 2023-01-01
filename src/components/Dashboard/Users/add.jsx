import { Link, useParams, useHistory } from 'react-router-dom';
import $ from 'jquery';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import LoaderButton from '../../Common/LoaderButton';

function Add() {
  const [error, setError] = useState(null);

  const [roleerror, setroleerror] = useState(null);
  const [departmenterror, setdepartmenterror] = useState(null);
  const [adminerror, setadminerror] = useState(null);
  const [apiresponseerror, setApiResponseError] = useState(null);
  const [btnLock, setBtnLock] = useState(false);

  const [user, setuser] = useState([]);
  const [finaluser, setfinaluser] = useState({});
  const [departments, setdepartments] = useState([]);
  const [roles, setroles] = useState([]);
  const [admins, setadmins] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);

  const [SelectedUserRoles, setSelectedUserRoles] = useState([]);
  const history = useHistory();

  //const crypto = require("crypto");

  // const Select = props => (
  //     <FixRequiredSelect
  //       {...props}
  //       SelectComponent={BaseSelect}
  //       options={props.options || options}
  //     />
  //   );

  useEffect(() => {
    fetch(`https://etma-sql.herokuapp.com/api/roles/GetRoles`)
      .then((res) => res.json())
      .then(
        (result) => {
          setroles(result.data);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    debugger;
    if (user.admin === '') {
      const c = { ...user };
      c.admin = '3';
      setuser(c);
    }

    if (SelectedUserRoles.length === 0) {
      user.userRole = [
        {
          roleId: 1,
        },
      ];
      //return;
    } else {
      user.userRole = [];

      SelectedUserRoles.forEach((item) => {
        user.userRole.push({
          roleId: parseInt(item.value),
        });
      });
    }
    if (!user.admin || !user.department) {
      return;
    }

    // user.admin = user.admin._id;
    // user.userId = user._id;
    // finaluser.userId = user.userId;

    finaluser.name = user.name;
    finaluser.email = user.email;
    finaluser.departmentId = parseInt(user.department);
    finaluser.batchNo = user.batchNo;
    finaluser.userRole = user.userRole;
    finaluser.adminId = parseInt(user.admin);
    setBtnLock(true);

    fetch('https://etma-sql.herokuapp.com/api/user/SaveUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finaluser),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.code !== 1) {
          setBtnLock(false);

          Swal.fire({
            title: data.message.message,
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
            title: 'User Saved!',
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

  // if (error) {
  //     return <div>Error: {error.message}</div>;
  // } else if (!isLoaded) {
  //     return <div>Loading...</div>;
  // } else {
  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Add User</title>
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
                        <img src='/assets/images/Back.png' alt='back arrow' />
                      </div>
                      Create User
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
          <div className='row'>
            <div className='col-12'>
              <div className='card mb-4'>
                <div className='card-body'>
                  <form
                    className='add-new'
                    action='/users'
                    onSubmit={handleSubmit}
                  >
                    <div className='form-2'>
                      <div className='row form-inner-row'>
                        <div className='form-group name-field col-md-4'>
                          <label htmlFor='form-label'>User Name</label>
                          <input
                            type='text'
                            className='form-control add-form-control'
                            id='InputName'
                            placeholder='Adam Hawkins'
                            required
                            onChange={(event) => {
                              const b = { ...user };
                              b.name = event.target.value;
                              setuser(b);
                            }}
                          />
                        </div>
                        <div className='form-group col-md-4'>
                          <label
                            htmlFor='inputEmail'
                            className='col-form-label'
                          >
                            Email
                          </label>
                          <input
                            type='email'
                            className='form-control add-form-control'
                            id='inputEmail'
                            placeholder='Amber@gmail.com'
                            required
                            onChange={(event) => {
                              const b = { ...user };
                              b.email = event.target.value;
                              setuser(b);
                            }}
                          />
                        </div>

                        <div className='form-group col-md-4'>
                          <label htmlFor='form-label'>Admin</label>
                          <select
                            id='input-select'
                            className='form-control add-form-control'
                            onChange={(event) => {
                              const b = { ...user };
                              b.admin = event.target.value;
                              setuser(b);
                              setadminerror('');
                            }}
                          >
                            {admins.length === 0 ? (
                              <option>Loading...</option>
                            ) : (
                              <>
                                <option value=''>Select Admin</option>
                                {admins.map((item, i) => {
                                  return (
                                    <option
                                      value={item.AdminId}
                                      key={item.AdminId}
                                    >
                                      {item.Description}
                                    </option>
                                  );
                                })}
                              </>
                            )}
                          </select>
                          {adminerror ? (
                            <div class='text-danger'>Required.</div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>
                      <div className='row form-inner-row'>
                        <div className='form-group col-md-4'>
                          <label htmlFor='form-label'>Batch No</label>
                          <input
                            type='text'
                            className='form-control add-form-control'
                            id='inputBatchNo'
                            placeholder='02'
                            required
                            onChange={(event) => {
                              const b = { ...user };
                              b.batchNo = event.target.value;
                              setuser(b);
                            }}
                          />
                        </div>
                        <div className='form-group col-md-4'>
                          <label htmlFor='form-label'>Role</label>
                          <Select
                            isMulti
                            name='colors'
                            options={
                              roles.length === 0
                                ? [
                                    {
                                      value: '',
                                      label: 'Loading...',
                                    },
                                  ]
                                : roles.map(function (item) {
                                    return {
                                      value: item.RoleId,
                                      label: item.Description,
                                    };
                                  })
                            }
                            isSearchable
                            required
                            onChange={(option) => setSelectedUserRoles(option)}
                            // onChange={(event) => {
                            //     setRequiredError({roleerror: ''});
                            //     //requirederror.roleerror='';
                            // }}

                            className='basic-multi-select'
                            classNamePrefix='select'
                          />
                          {roleerror ? (
                            <div class='text-danger'>Required.</div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                        <div className='form-group col-md-4'>
                          <label htmlFor='form-label'>Department</label>
                          <select
                            id='input-select'
                            className='form-control add-form-control'
                            required
                            onChange={(event) => {
                              const b = { ...user };
                              b.department = event.target.value;
                              setuser(b);
                              setdepartmenterror('');
                              //requirederror.departmenterror = '';
                            }}
                          >
                            {departments.length === 0 ? (
                              <option>Loading...</option>
                            ) : (
                              <>
                                <option value=''>Select Department</option>
                                {departments.map((item, i) => {
                                  return (
                                    <option
                                      value={item.DepartmentId}
                                      key={item.DepartmentId}
                                    >
                                      {item.Description}
                                    </option>
                                  );
                                })}
                              </>
                            )}
                          </select>
                          {departmenterror ? (
                            <div class='text-danger'>Required.</div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='form-btns'>
                      <button
                        disabled={btnLock}
                        type='submit'
                        className='btn form-btn btn-outline-primary apply-btn mb-0'
                      >
                        Save
                        {btnLock ? (
                          <div class='btnloader'>{LoaderButton}</div>
                        ) : (
                          ''
                        )}
                      </button>
                      <Link
                        to='/users'
                        className='btn form-btn btn-primary cancel-btn mb-0'
                      >
                        Cancel
                      </Link>
                    </div>
                  </form>
                </div>
              </div>

              {apiresponseerror ? (
                <div class='text-danger'>{apiresponseerror}</div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
  // }
}

export default Add;
