import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, useHistory, Redirect } from 'react-router-dom';
import Select from 'react-select';
const BookletAssignmentBooklet = () => {
  const [booklets, setBooklets] = useState([]);
  const [allBooklets, setAllBooklets] = useState([]);
  const [repetitions, setRepetitions] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [versionData, setVersionData] = useState([]);
  const [qualificationTypeShow, setQualificationTypeShow] = useState(true);
  useEffect(() => {
    fetch(`https://etma-sql.herokuapp.com/api/booklets/GetBookletsName`)
      .then((res) => res.json())
      .then((result) => {
        setBooklets(result.data);
      });
  }, []);

  useEffect(() => {
    fetch(`https://etma-sql.herokuapp.com/api/booklets/GetBooklets`)
      .then((res) => res.json())
      .then((result) => {
        setAllBooklets(result.data);
      });
  }, []);

  useEffect(() => {
    fetch(`https://etma-sql.herokuapp.com/api/repetitions/GetRepetitions`)
      .then((res) => res.json())
      .then((result) => {
        setRepetitions(result.data);
      });
  }, []);

  useEffect(() => {}, [versionData]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const filterItem = allBooklets.filter((item) => {
      return (
        item.name === selectedUsername.label &&
        item.version === selectedVersion.label
      );
    });

    setSelectedUsername(filterItem);
    setRedirect(true);
  };

  if (redirect)
    return (
      <Redirect
        to={{
          pathname: '/booklet-assignment/assign',
          data: {
            selectedType: selectedType,
            selectedUsername: selectedUsername,
            selectedVersion: selectedVersion,
          },
        }}
      />
    );
  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Booklet Select</title>
      </Helmet>
      <main className='manage-users-main'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <div className='dashboardheaderbar d-flex justify-content-between align-items-center'>
                <Link to='/booklet-assignment'>
                  <h1 className='dashboardtitle create-dashboardtitle'>
                    <div className='arrow-icon-dashboardtitle'>
                      <img src='/assets/images/Back.png' alt='back arrow' />
                    </div>
                    Select Booklet
                  </h1>
                </Link>
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
                        <div className='form-group col-md-4'>
                          <label htmlFor='form-label'>Booklet Name</label>
                          <Select
                            name='bookletname'
                            options={
                              booklets.length === 0
                                ? [
                                    {
                                      value: '',
                                      label: 'Loading...',
                                    },
                                  ]
                                : booklets.map(function (item) {
                                    return {
                                      value: item.BookletName,
                                      label: item.BookletName,
                                    };
                                  })
                            }
                            isSearchable
                            required
                            onChange={(option) => {
                              fetch(
                                `https://etma-sql.herokuapp.com/api/booklets/GetVersionByBooklet`,
                                {
                                  method: 'POST', // or 'PUT'
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    name: option.value,
                                  }),
                                }
                              )
                                .then((res) => res.json())
                                .then((result) => {
                                  setVersionData(result.data);
                                });

                              setSelectedUsername(option);
                            }}
                            // onChange={(event) => {
                            //     setRequiredError({roleerror: ''});
                            //     //requirederror.roleerror='';
                            // }}

                            className='basic-multi-select'
                            classNamePrefix='select'
                          />
                          <input
                            tabIndex={-1}
                            autoComplete='off'
                            style={{ opacity: 0, height: 0 }}
                            required
                            value={selectedUsername.value}
                          />
                        </div>
                        <div className='form-group col-md-4'>
                          <label htmlFor='form-label'>Version</label>
                          <Select
                            name='bookletname'
                            options={
                              versionData.length === 0
                                ? [
                                    {
                                      value: '',
                                      label: 'No Data...',
                                    },
                                  ]
                                : versionData.map(function (item) {
                                    return {
                                      value: item.Version,
                                      label: item.Version,
                                    };
                                  })
                            }
                            isSearchable
                            required
                            onChange={(option) => {
                              setSelectedVersion(option);
                              let isCatA = false;
                              for (let i = 0; i < allBooklets.length; i++) {
                                if (
                                  allBooklets[i].name ===
                                    selectedUsername.label &&
                                  allBooklets[i].version === option.label
                                ) {
                                  if (allBooklets[i].type === 'CAT A') {
                                    isCatA = true;
                                  } else {
                                    isCatA = false;
                                  }
                                }
                              }

                              if (isCatA) {
                                setQualificationTypeShow(false);
                                setSelectedType({
                                  label: 'QT',
                                  value: 1,
                                });
                              } else {
                                setQualificationTypeShow(true);
                              }
                            }}
                            // onChange={(event) => {
                            //     setRequiredError({roleerror: ''});
                            //     //requirederror.roleerror='';
                            // }}

                            className='basic-multi-select'
                            classNamePrefix='select'
                          />
                          <input
                            tabIndex={-1}
                            autoComplete='off'
                            style={{ opacity: 0, height: 0 }}
                            required
                            value={selectedVersion.value}
                          />
                        </div>
                        {qualificationTypeShow ? (
                          <div className='form-group col-md-4'>
                            <label htmlFor='form-label'>
                              Qualification Type
                            </label>
                            <Select
                              name='taskstype'
                              options={
                                repetitions.length === 0
                                  ? [
                                      {
                                        value: '',
                                        label: 'Loading...',
                                      },
                                    ]
                                  : repetitions.map(function (item) {
                                      return {
                                        value: item.QualificationTypeId,
                                        label: item.Description,
                                      };
                                    })
                              }
                              isSearchable
                              required
                              onChange={(option) => setSelectedType(option)}
                              // onChange={(event) => {
                              //     setRequiredError({roleerror: ''});
                              //     //requirederror.roleerror='';
                              // }}

                              className='basic-multi-select'
                              classNamePrefix='select'
                            />
                            <input
                              tabIndex={-1}
                              autoComplete='off'
                              style={{ opacity: 0, height: 0 }}
                              value={selectedType.value}
                              required
                            />
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className='form-btns'>
                      <button
                        type='submit'
                        className='btn form-btn btn-outline-primary apply-btn mb-0'
                      >
                        Choose Users
                      </button>
                      <Link
                        to='/booklet-assignment'
                        className='btn form-btn btn-primary cancel-btn mb-0'
                      >
                        Cancel
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default BookletAssignmentBooklet;
