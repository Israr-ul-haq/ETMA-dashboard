import $ from 'jquery';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loader from '../../Common/Loader';
function All() {
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [bookletCount, setBookletCount] = useState(0);
  const [loader, setloader] = useState(true);
  const history = useHistory();
  useEffect(() => {
    if (bookletCount === 0) {
      fetch('https://etma-sql.herokuapp.com/api/booklets/GetBooklets')
        .then((res) => res.json())
        .then(
          (result) => {
            setloader(false);
            setItems(result.data);
            $('.table').DataTable({
              ordering: false,
              dom: 'Bfrtip',
              buttons: [
                {
                  extend: 'pdf',
                  footer: true,
                  exportOptions: {
                    columns: [1, 2, 3, 4, 5],
                  },
                },
                {
                  extend: 'csv',
                  footer: false,
                  exportOptions: {
                    columns: [1, 2, 3, 4, 5],
                  },
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
          (error) => {
            setError(error);
          }
        );
    }

    setBookletCount(1);
  }, [items, bookletCount]);

  const deleteItem = (itemID) => {
    Swal.fire({
      title: 'Are you sure, you want to delete this Booklet?',
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
        fetch(
          `https://etma-sql.herokuapp.com/api/booklets/DeleteBooklet/${itemID}`,
          {
            method: 'POST',
          }
        )
          .then(function (res) {
            return res.json();
          })
          .then(function (result) {
            window.location.reload(false);
          });

        // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  };

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Booklets</title>
      </Helmet>
      <main className='manage-users-main'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <div className='dashboardheaderbar d-flex justify-content-between align-items-center'>
                <h1 className='dashboardtitle'>Manage Booklets</h1>
                <div className='btngroup'>
                  <Link to='/booklets/add'>
                    <button
                      type='button'
                      className='btn btn-outline-primary dashboardtitle-btn'
                    >
                      Create Booklet
                    </button>
                  </Link>
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
                          <th hidden>Booklet Id</th>
                          <th>Booket Name</th>
                          <th>Status</th>
                          {/* <th>Created Date</th>
                        <th>Published Date</th> */}
                          <th>Type</th>
                          <th>Version</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => {
                          return (
                            <tr id={item.id} key={item.id}>
                              <td>{index + 1}</td>
                              <td hidden  >{item.id}</td>
                              <td class="tableitem_width">{item.name}</td>
                              <td>{item.isDraft ? 'Draft' : 'Published'}</td>
                              {/* <td>{new Date(item.date).toLocaleString()}</td>
                            <td>
                              {new Date(item.publishedDate).toLocaleString()}
                            </td> */}
                              <td>{item.type}</td>
                              <td>{item.version}</td>
                              <td>
                                <div className='actionbtns'>
                                  {item.isDraft === false ? (
                                    ''
                                  ) : (
                                    <Link
                                      to={`/booklets/edit/${item.id}`}
                                      className='listcardtable__actionbtn'
                                    >
                                      <img
                                        src='/assets/images/Edit.svg'
                                        alt='edit data table'
                                      />
                                    </Link>
                                  )}
                                  {item.isDraft === false ? (
                                    <Link
                                      to={`/booklets/view/${item.id}`}
                                      className='listcardtable__actionbtn'
                                    >
                                      <img
                                        src='/assets/images/view.svg'
                                        alt='edit data table'
                                      />
                                    </Link>
                                  ) : (
                                    ''
                                  )}
                                  {/* <a
                                href='#'
                                data-toggle='modal'
                                data-target='.blockUserModal'
                              >
                                <img
                                  src='./assets/images/Block.png'
                                  alt='block data table'
                                />
                              </a> */}
                                  {item.isDraft === false ? (
                                    ''
                                  ) : (
                                    <button
                                      style={{
                                        padding: '0',
                                        backgroundColor: 'unset',
                                        border: 'unset',
                                      }}
                                      className='listcardtable__actionbtn'
                                      onClick={() => deleteItem(item.id)}
                                    >
                                      <img
                                        src='/assets/images/delete.svg'
                                        alt='delete data table'
                                      />
                                    </button>
                                  )}
                                </div>
                              </td>
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
        </div>
      </main>
    </>
  );
}
export default All;
