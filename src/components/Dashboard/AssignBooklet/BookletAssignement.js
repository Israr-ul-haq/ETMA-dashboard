import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loader from '../../Common/Loader';
import jsPDF from 'jspdf';
import DataTable from 'react-data-table-component';
import 'jspdf-autotable';
import SelectFilter from '../Filter/SelectFilter';
import TextFilter from '../Filter/TextFilter';
import { version } from 'react-dom';
import Clear from '../Filter/Clear';
import Select from 'react-select';
function BookletAssignement() {
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [booklets, setBooklets] = useState([]);
  const [bookletVersion, setBookletVersion] = useState('');
  const [bookletType, setBookletType] = useState('');
  const [bookletUsername, setBookletUsername] = useState('');
  const [bookletBatch, setBookletBatch] = useState('');
  const [bookletEmail, setBookletEmail] = useState('');
  const [filteredItemsCount, setFilteredItemsCount] = useState(0);
  const [departments, setdepartments] = useState([]);
  const [selectedBooklet, setSelectedBooklet] = useState({
    label: 'Please Select',
    value: '',
  });
  const [selectedDepartment, setSelectedDepartment] = useState({
    label: 'Please Select',
    value: '',
  });
  const [selectedBookletType, setSelectedBookletType] = useState({
    label: 'Please Select',
    value: '',
  });
  const [bookletTypes, setbookletTypes] = useState([]);
  const [selectedTaskType, setSelectedTaskType] = useState({
    label: 'Please Select',
    value: '',
  });
  const [taskTypes, settaskTypes] = useState([]);
  const data = [
    {
      name: '',
      version: '',
      bookletType: null,
      repetitionId: null,
      username: '',
      email: '',
      department: null,
      batchNo: '',
    },
  ];

  useEffect(() => {
    if (bookletTypes.length === 0) {
      fetch(`https://etma-sql.herokuapp.com/api/bookletTypes/GetBookletTypes`)
        .then((res) => res.json())
        .then(
          (result) => {
            const emptyFirstArray = [
              {
                BookletTypeId: 0,
                Description: 'Please Select',
              },
            ];

            setbookletTypes(emptyFirstArray.concat(result.data));
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {}
        );
    }
  }, [bookletTypes]);
  useEffect(() => {
    if (taskTypes.length === 0) {
      fetch(`https://etma-sql.herokuapp.com/api/repetitions/GetRepetitions`)
        .then((res) => res.json())
        .then(
          (result) => {
            const emptyFirstArray = [
              {
                QualificationTypeId: 0,
                Description: 'Please Select',
              },
            ];

            settaskTypes(emptyFirstArray.concat(result.data));
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {}
        );
    }
  }, [taskTypes]);

  function convertArrayOfObjectsToCSV(array) {
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

        if (key === 'department') {
          let finalValue;
          let departmentName = departments.map((department) => {
            if (department._id === item.assignedTo[0][key])
              finalValue = department.name;

            return finalValue;
          });

          result += departmentName[0];
        } else if (key === 'username') {
          result += item.assignedTo[0]['name'];
        } else if (key === 'batchNo') {
          result += item.assignedTo[0][key];
        } else if (key === 'email') {
          result += item.assignedTo[0][key];
        } else {
          result += item[key];
        }

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

  const [filteredItems, setFilteredItems] = useState([]);
  const [loader, setloader] = useState(true);

  useEffect(() => {
    fetch('https://etma-sql.herokuapp.com/api/booklets/GetBookletsName')
      .then((res) => res.json())
      .then(
        (result) => {
          setloader(false);

          const emptyFirstArray = [
            {
              label: 0,
              BookletName: 'Please Select',
            },
          ];

          setItems(emptyFirstArray.concat(result.data));
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
    if (filteredItemsCount === 0) {
      fetch('https://etma-sql.herokuapp.com/api/booklets/GetCopyBooklets', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '',
          version: '',
          bookletType: null,
          repetitionId: null,
          username: '',
          email: '',
          department: null,
          batchNo: '',
        }),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            setloader(false);
            setFilteredItems(result.data);
            setBooklets(result.data);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setError(error);
          }
        );
      setFilteredItemsCount(2);
    }
  }, [filteredItems, filteredItemsCount]);

  useEffect(() => {
    fetch(`https://etma-sql.herokuapp.com/api/departments/GetDepartments`)
      .then((res) => res.json())
      .then(
        (result) => {
          const emptyFirstArray = [
            {
              DepartmentId: 0,
              Description: 'Please Select',
            },
          ];

          setdepartments(emptyFirstArray.concat(result.data));
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  }, []);

  const handleFilter = () => {
    setloader(true);
    fetch('https://etma-sql.herokuapp.com/api/booklets/GetCopyBooklets', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name:
          selectedBooklet.label.toLowerCase() === 'please select'
            ? ''
            : selectedBooklet.label,
        email: bookletEmail,
        department:
          selectedDepartment.label.toLowerCase() === 'please select'
            ? null
            : selectedDepartment.value,
        batchNo: bookletBatch,
        version: bookletVersion,
        bookletType:
          selectedBookletType.label.toLowerCase() === 'please select'
            ? null
            : selectedBookletType.value,
        repetitionId:
          selectedTaskType.label.toLowerCase() === 'please select'
            ? null
            : selectedTaskType.value,
        username: bookletUsername,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          debugger;
          setloader(false);
          setFilteredItems(result.data);
          setBooklets(result.data);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  };

  const handleClear = () => {
    setSelectedBooklet({
      label: 'Please Select',
      value: '',
    });
    setBookletEmail('');
    setSelectedDepartment({
      label: 'Please Select',
      value: '',
    });
    setSelectedBookletType({
      label: 'Please Select',
      value: '',
    });
    setSelectedTaskType({
      label: 'Please Select',
      value: '',
    });
    setBookletBatch('');
    setBookletType('');
    setBookletVersion('');
    setBookletUsername('');
    setloader(true);
    fetch('https://etma-sql.herokuapp.com/api/booklets/GetCopyBooklets', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '',
        email: '',
        department: null,
        batchNo: '',
        version: '',
        bookletType: null,
        repetitionId: null,
        username: '',
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

  const columns = [
    {
      name: 'Booklet Name',
      selector: 'name',
      sortable: true,
    },
    {
      name: 'Version',
      selector: 'version',
      sortable: true,
    },
    {
      name: 'Booklet Type',
      selector: 'type',
      sortable: true,
    },
    {
      name: 'Qualification Type',
      selector: 'repetitions',
      sortable: true,
    },
    {
      name: 'Username',
      selector: (row) => row.assignedTo,
      sortable: true,
    },
    {
      name: 'Batch',
      selector: (row) => row.batchNo,
      sortable: true,
    },
    {
      name: 'Department',
      selector: (row) => row.department,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
  ];

  const exportPDF = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'portrait'; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = 'Booklets';
    const headers = [
      [
        'Booklet Name',
        'Version',
        'Booklet Type',
        'Task Type',
        'Username',
        'Batch',
        'Department',
        'Email',
      ],
    ];

    const data = booklets.map((elt) => {
      let departmentName = departments.map((item) => {
        return item._id === elt.assignedTo[0].department ? item.name : '';
      });
      return [
        elt.name,
        elt.version,
        elt.type,
        elt.assignedTo[0].name,
        elt.assignedTo[0].batchNo,
        departmentName[0],
        elt.assignedTo[0].email,
      ];
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
        <title>Booklet Assignment</title>
      </Helmet>
      <main className='manage-users-main'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <div className='dashboardheaderbar d-flex justify-content-between align-items-center'>
                <h1 className='dashboardtitle'>Booklet Assignment </h1>
                <div className='btngroup'>
                  <Link to='/booklet-assignment/booklet'>
                    <button
                      type='button'
                      className='btn btn-outline-primary dashboardtitle-btn'
                    >
                      Assign Booklet
                    </button>
                  </Link>
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
                        <Select
                          className='basic-multi-select '
                          classNamePrefix='select'
                          onChange={(option) => setSelectedBooklet(option)}
                          value={selectedBooklet}
                          options={
                            items.length === 0
                              ? [
                                  {
                                    value: '',
                                    label: 'Loading...',
                                  },
                                ]
                              : items.map(function (item) {
                                  return {
                                    value: item.BookletName,
                                    label: item.BookletName,
                                  };
                                })
                          }
                        />
                      </div>
                      <div className='form-group name-field col-md-4'>
                        <label htmlFor='form-label'>Booklet Version</label>
                        <TextFilter
                          text={bookletVersion}
                          onFilter={(event) =>
                            setBookletVersion(event.target.value)
                          }
                          placeholder={'Enter Booklet Version'}
                        />
                      </div>
                      <div className='form-group name-field col-md-4'>
                        <label htmlFor='form-label'>Booklet Types</label>
                        <Select
                          className='basic-multi-select '
                          classNamePrefix='select'
                          onChange={(option) => setSelectedBookletType(option)}
                          value={selectedBookletType}
                          options={
                            bookletTypes.length === 0
                              ? [
                                  {
                                    value: '',
                                    label: 'Loading...',
                                  },
                                ]
                              : bookletTypes.map(function (item) {
                                  return {
                                    value: item.BookletTypeId,
                                    label: item.Description,
                                  };
                                })
                          }
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
                      <div className='form-group name-field col-md-4'>
                        <label htmlFor='form-label'>Qualification Type</label>
                        <Select
                          className='basic-multi-select '
                          classNamePrefix='select'
                          onChange={(option) => setSelectedTaskType(option)}
                          value={selectedTaskType}
                          options={
                            taskTypes.length === 0
                              ? [
                                  {
                                    value: '',
                                    label: 'Loading...',
                                  },
                                ]
                              : taskTypes.map(function (item) {
                                  return {
                                    value: item.QualificationTypeId,
                                    label: item.Description,
                                  };
                                })
                          }
                        />
                      </div>
                      <div
                        className='form-group name-field col-md-4'
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
                          onClick={() => downloadCSV(booklets)}
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
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
export default BookletAssignement;
