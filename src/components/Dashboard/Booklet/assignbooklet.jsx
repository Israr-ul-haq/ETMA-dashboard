import {Link} from "react-router-dom";

function AssignBooklet()
{
    return(
        <main className="manage-users-main">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="dashboardheaderbar d-flex justify-content-between align-items-center">
                            <div className="filter-user-top-bar">
                                <div className="arrow-icon-dashboardtitle">
                                    <Link to="/assign-booklet"><img src="/assets/images/Back.png"/></Link>
                                </div>
                                <h1 className="dashboardtitle create-dashboardtitle">Assign Booklet</h1>
                            </div>
                            <div className="btngroup">
                                <Link to="#">
                                    <button type="button" className="btn btn-outline-primary dashboardtitle-btn">Publish
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <form className="add-new create-booklet-form">
                            <div className="form-2">
                                <div className="row form-inner-row">
                                    <div className="form-group name-field col-md-4">
                                        <label htmlFor="form-label">Booklet ID</label>
                                        <input type="number" className="form-control add-form-control" id="InputID"
                                               placeholder="07" required/>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label htmlFor="inputEmail" className="col-form-label">Booklet Name</label>
                                        <input type="text" className="form-control add-form-control" id="inputname"
                                               placeholder="Booklet 2" required/>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label htmlFor="inputDept" className="col-form-label">Booklet Type</label>
                                        <select id="input-select" className="form-control add-form-control" required>
                                            <option defaultValue>SST</option>
                                            <option>GMT</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row form-inner-row">
                                    <div className="form-group col-md-4">
                                        <label htmlFor="form-label">QT/ QST</label>
                                        <select id="input-select" className="form-control add-form-control" required>
                                            <option defaultValue>QT</option>
                                            <option>QST</option>
                                        </select>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label htmlFor="form-label">Version</label>
                                        <input type="text" className="form-control add-form-control" id="inputRole"
                                               placeholder="1.0.0" required/>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-12 mb-4">
                    <div className="card card-create-booklet">
                        <div className="card-body table-inner">
                            <div className="card-body-top-row">
                                <div className="card-body-top-row-left">
                                    <div
                                        className="card-body-top-row-left-inner card-body-top-row-left1 card-body-top-row-left1-ex">
                                        <h4 className="mb-4 second-title">Export Users:</h4>
                                        <div className="dt-buttons btn-group">
                                            <button
                                                className="btn btn-secondary buttons-pdf buttons-html5 btn-primary table-small-btn table-small-btn1"
                                                tabIndex="0" aria-controls="driverDetails"><span>PDF</span></button>
                                            <button
                                                className="btn btn-secondary buttons-csv buttons-html5 btn-primary table-small-btn"
                                                tabIndex="0"><span>CSV</span></button>
                                        </div>
                                    </div>


                                </div>

                                <div className="dataTables_filter-div">

                                    <div id="driverDetails_filter" className="dataTables_filter dataTables_filter-left">
                                        <p className="filter-text">Filter</p>
                                        <Link to="FilterBookletAssignment.html">
                                            <img src="/assets/images/Filter.png"/></Link>
                                    </div>
                                    <div id="driverDetails_filter" className="dataTables_filter">
                                        <button className="btn-search">
                                            <img src="/assets/images/search.png"/>
                                        </button>
                                        <input type="search" className="form-control form-control-sm search-field"
                                               placeholder="Search"/>
                                    </div>

                                    <div className="btngroup">
                                        <Link to="#">
                                            <button type="button"
                                                    className="btn btn-outline-primary dashboardtitle-btn add-task-btn">Add
                                                User +
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <table className="data-table data-table-feature" id="data-table-etma">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Batch No</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>01</td>
                                    <td>Lahiana Grill</td>
                                    <td>Lahaina@gmail.com</td>
                                    <td>Tech</td>
                                    <td>02</td>
                                    <td>
                                        <div className="actionbtns">
                                            <Link to="#" className="listcardtable__actionbtn"><img
                                                src="/assets/images/Delete.svg" alt="edit data table"/></Link>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>02</td>
                                    <td>Adam Hawkins</td>
                                    <td>Janice@gmail.com</td>
                                    <td>Marketing</td>
                                    <td>04</td>
                                    <td>
                                        <div className="actionbtns">
                                            <Link to="#" className="listcardtable__actionbtn"><img
                                                src="/assets/images/Delete.svg" alt="edit data table"/></Link>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>03</td>
                                    <td>Craig Clark</td>
                                    <td>CraigClark@gmail.com</td>
                                    <td>Tech</td>
                                    <td>05</td>
                                    <td>
                                        <div className="actionbtns">
                                            <Link to="#" className="listcardtable__actionbtn"><img
                                                src="/assets/images/Delete.svg" alt="edit data table"/></Link>

                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>04</td>
                                    <td>Alice Mendez</td>
                                    <td>Aliceez@gmail.com</td>
                                    <td>Tech</td>
                                    <td>23</td>
                                    <td>
                                        <div className="actionbtns">
                                            <Link to="#" className="listcardtable__actionbtn"><img
                                                src="/assets/images/Delete.svg" alt="edit data table"/></Link>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>05</td>
                                    <td>Janice Oliver</td>
                                    <td>Janice@gmail.com</td>
                                    <td>Marketing</td>
                                    <td>12</td>
                                    <td>
                                        <div className="actionbtns">
                                            <Link to="#" className="listcardtable__actionbtn"><img
                                                src="/assets/images/Delete.svg" alt="edit data table"/></Link>

                                        </div>
                                    </td>
                                    <td/>
                                    <td/>

                                </tr>
                                <tr>
                                    <td>06</td>
                                    <td>George Bailey</td>
                                    <td>George@gmail.com</td>
                                    <td>Marketing</td>
                                    <td>43</td>
                                    <td>
                                        <div className="actionbtns">
                                            <Link to="#" className="listcardtable__actionbtn"><img
                                                src="/assets/images/Delete.svg" alt="edit data table"/></Link>

                                        </div>
                                    </td>
                                    <td/>
                                    <td/>

                                </tr>
                                <tr>
                                    <td>07</td>
                                    <td>Frank Green</td>
                                    <td>Frank@gmail.com</td>
                                    <td>Tech</td>
                                    <td>43</td>
                                    <td>
                                        <div className="actionbtns">
                                            <Link to="#" className="listcardtable__actionbtn"><img
                                                src="/assets/images/Delete.svg" alt="edit data table"/></Link>

                                        </div>
                                    </td>


                                </tr>
                                <tr>
                                    <td>08</td>
                                    <td>Amber Stanley</td>
                                    <td>Amber@gmail.com</td>
                                    <td>Marketing</td>
                                    <td>42</td>
                                    <td>
                                        <div className="actionbtns">
                                            <Link to="#" className="listcardtable__actionbtn"><img
                                                src="/assets/images/Delete.svg" alt="edit data table"/></Link>

                                        </div>
                                    </td>


                                </tr>
                                <tr>
                                    <td>09</td>
                                    <td>Eugene Colem</td>
                                    <td>Eugene@gmail.com</td>
                                    <td>Marketing</td>
                                    <td>11</td>
                                    <td>
                                        <div className="actionbtns">
                                            <Link to="#" className="listcardtable__actionbtn"><img
                                                src="/assets/images/Delete.svg" alt="edit data table"/></Link>

                                        </div>
                                    </td>

                                </tr>

                                </tbody>
                            </table>

                        </div>
                    </div>

                    <div className="form-btns">
                        <button type="submit" className="btn form-btn btn-outline-primary apply-btn mb-0">Assign
                        </button>
                        <button type="button" className="btn form-btn btn-primary cancel-btn mb-0">Cancel</button>
                    </div>

                </div>
            </div>
        </main>
    );
}
export default AssignBooklet;