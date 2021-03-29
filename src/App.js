import React, { Fragment, useEffect, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import {
  devicePageAnimation,
  headerAnimation,
  paginationAnimation,
  tableRowAnimation,
  devicePageHeaderAnimation,
  backdropAnimation,
  modalAnimation,
} from "./motionSettings";

function App() {
  const pages = [];
  const [isVisible, setVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [newData, setNewData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null,
  });

  const [tempInfo, setRowInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [row, setRow] = useState({
    madel: "",
    macAddress: "",
    description: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const pageNumberLimit = 4;
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(4);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

  let pageIncrementBtn = null;
  let pageDecrementBtn = null;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  if (!loading) {
    for (let i = 1; i <= Math.ceil(newData.length / itemsPerPage); i++) {
      pages.push(i);
    }
  }

  if (pages.length > maxPageNumberLimit) {
    pageIncrementBtn = <li onClick={handleNextButton}> &hellip; </li>;
  }

  if (minPageNumberLimit >= 1) {
    pageDecrementBtn = <li onClick={handlePreviousButton}> &hellip; </li>;
  }

  function handleClick(event) {
    setCurrentPage(Number(event.target.id));
  }

  function handlePreviousButton() {
    setCurrentPage(currentPage - 1);

    if ((currentPage - 1) % pageNumberLimit === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  }

  function handleNextButton() {
    setCurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  }

  async function getData() {
    setLoading(true);

    axios
      .get("http://localhost:4001/api/devices/", {
        headers: {
          Authorization: "Token 123",
          "Content-Type": "application/json",
        },
      })
      .then(() => console.log(`SUCCESS`))
      .catch((error) => {
        console.log(`Get error...`, { error: error.message });
      });

    return await axios
      .get("./config/config.json")
      .then((res) => {
        setNewData(res.data.devices);
        return res.data;
      })
      .then((res) => {
        setLoading(false);
        console.log(res);
      })
      .catch((error) => {
        console.log(`nothing there...`, { error: error.message });
      });
  }

  useEffect(() => {
    const response = getData();
    console.log(`data retrieved : `, response);
  }, []);

  useEffect(() => {
    if (!loading) {
      let currentItems =
        newData &&
        newData.length > 0 &&
        newData.slice(indexOfFirstItem, indexOfLastItem);

      const search = searchInput.trim().toLowerCase();

      if (search.length > 0) {
        currentItems = currentItems.filter((e) =>
          e.model.toLowerCase().match(search)
        );
      }

      setFiltered(currentItems);
    }
  }, [loading, newData, indexOfFirstItem, indexOfLastItem, searchInput]);

  function handleSearch(event) {
    let searchValue = event.target.value;
    setSearchInput(searchValue);
  }

  function handleChange(event) {
    setRowInfo({
      ...tempInfo,
      [event.target.name]: event.target.value,
    });
  }

  function handleAddInputChange(event) {
    setRow({
      ...row,
      [event.target.name]: event.target.value,
    });
  }

  function handleCancelInputChange() {
    setRow({
      ...row,
      model: "",
      macAddress: "",
      description: "",
    });
    setVisible(false);
  }

  function onEdit({ key }) {
    setRowInfo(newData.find((item) => item.key === key));
    setInEditMode({ status: true, rowKey: key });
  }

  function onCancel() {
    setInEditMode({ status: false, rowKey: null });
  }

  function onSave() {
    setInEditMode({ status: false, rowKey: null });
    const data = newData.map((item) =>
      item.key === tempInfo.key ? tempInfo : item
    );

    axios
      .put("http://localhost:4001/api/devices/:id", {
        headers: {
          Authorization: "Token 123",
          "Content-Type": "application/json",
        },
      })
      .then(() => console.log(`SUCCESS`))
      .catch((error) => {
        console.log(`Edit error...`, { error: error.message });
      });
    setNewData(data);
  }

  function onDelete(index) {
    newData.splice(index, 1);
    const data = newData.map((item) =>
      item.key === filtered.key ? filtered : item
    );
    axios
      .delete("http://localhost:4001/api/devices/:id", {
        headers: {
          Authorization: "Token 123",
          "Content-Type": "application/json",
        },
      })
      .then(() => console.log(`SUCCESS`))
      .catch((error) => {
        console.log(`Delete error...`, { error: error.message });
      });

    setNewData(data);
  }

  function onAdd() {
    const key = newData.length + 1;
    const device = {
      key: key.toString(),
      model: row.model,
      macAddress: row.macAddress,
      description: row.description,
    };

    const array = [...newData, device];
    axios
      .post("http://localhost:4001/api/devices", {
        headers: {
          Authorization: "Token 123",
          "Content-Type": "application/json",
        },

        body: JSON.stringify(device),
      })
      .then(() => console.log(`SUCCESS`))
      .catch((error) => {
        console.log(`Create error...`, { error: error.message });
      });
    setNewData(array);
    setVisible(false);
  }

  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li
          key={number}
          id={number}
          onClick={handleClick}
          className={currentPage === number ? "active" : null}
        >
          {number}
        </li>
      );
    } else {
      return null;
    }
  });

  const DevicePageSearchbar = () => (
    <div className="_title__searchbar">
      <input
        className="device-page__content__searchbar__input"
        key="random1"
        value={searchInput}
        placeholder={"search.."}
        onChange={(e) => {
          handleSearch(e);
        }}
      />
    </div>
  );

  const TableHeader = () => (
    <thead className="device-page__content__table__thead">
      <tr className="device-page__content__table__thead__tr">
        <motion.th
          {...headerAnimation}
          className="device-page__content__table__thead__tr_th-model"
        >
          Model
        </motion.th>
        <motion.th
          {...headerAnimation}
          className="device-page__content__table__thead__tr_th-mac-address"
        >
          Mac Address
        </motion.th>
        <motion.th
          {...headerAnimation}
          className="device-page__content__table__thead__tr_th-description"
        >
          Description
        </motion.th>
        <motion.th
          {...headerAnimation}
          className="device-page__content__table__thead__tr_th-action"
        >
          <button className="btn-add" onClick={() => setVisible(true)}>
            add
          </button>
        </motion.th>
      </tr>
    </thead>
  );

  const DevicePageHeader = () => {
    return <motion.h1 {...devicePageHeaderAnimation}>Device Page</motion.h1>;
  };

  const EditMode = (key) => inEditMode.status && inEditMode.rowKey === key;

  const DevicePageTableBody = (loading, filtered) => {
    return (
      <motion.tbody
        {...tableRowAnimation}
        className="device-page__content__table__tbody"
      >
        {filtered &&
          filtered.length > 0 &&
          filtered.map(({ model, key, macAddress, description }, index) => {
            return (
              <tr
                className={`device-page__content__table__tbody__tr`}
                key={index}
                draggable={true}
              >
                <td className="device-page__content__table__tbody__tr__td-model">
                  {EditMode(key) ? (
                    <input
                      className="input-model"
                      type="text"
                      name="model"
                      id="model"
                      value={tempInfo.model}
                      onChange={(event) => handleChange(event)}
                    />
                  ) : (
                    <Link style={{ textDecoration: "none" }} to="/page">
                      <span>{model}</span>
                    </Link>
                  )}
                </td>
                <td className="device-page__content__table__tbody__tr__td-mac-address">
                  {EditMode(key) ? (
                    <input
                      className="input-mac-address"
                      type="text"
                      name="macAddress"
                      id="macAddress"
                      value={tempInfo.macAddress}
                      onChange={(event) => handleChange(event)}
                    />
                  ) : (
                    <span>{macAddress}</span>
                  )}
                </td>
                <td className="device-page__content__table__tbody__tr__td-description">
                  {EditMode(key) ? (
                    <input
                      className="input"
                      type="text"
                      name="description"
                      id="description"
                      value={tempInfo.description}
                      onChange={(event) => handleChange(event)}
                    />
                  ) : (
                    <span>{description}</span>
                  )}
                </td>
                <td className="actions">
                  {inEditMode.status && inEditMode.rowKey === key ? (
                    <Fragment>
                      <button className="btn-save" onClick={() => onSave()}>
                        Save
                      </button>

                      <button className="btn-cancel" onClick={() => onCancel()}>
                        Cancel
                      </button>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <button
                        className="btn-edit"
                        onClick={() => onEdit({ key, newData })}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => onDelete(index)}
                      >
                        Delete
                      </button>
                    </Fragment>
                  )}
                </td>
              </tr>
            );
          })}
      </motion.tbody>
    );
  };

  const DevicePagePreviousBtn = () => {
    return (
      <li className="page-numbers__previous-btn">
        <button
          className="page-numbers__previous-btn_btn"
          onClick={handlePreviousButton}
          disabled={currentPage === pages[0]}
        >
          Prev
        </button>
      </li>
    );
  };

  const DevicePageNextBtn = () => {
    return (
      <li className="page-numbers__next-btn">
        <button
          className="page-numbers__next-btn_btn"
          onClick={handleNextButton}
          disabled={currentPage === pages[pages.length - 1]}
        >
          Next
        </button>
      </li>
    );
  };

  const Modal = () => (
    <motion.div {...backdropAnimation} className="modal">
      <motion.div {...modalAnimation} className="modal__container">
        <div className="modal__container__header">
          <span>Add a device</span>
          <button
            className="modal__container__header__btn"
            onClick={() => setVisible(false)}
          >
            Close
          </button>
        </div>
        <div className="modal__container__input">
          <div className="input-group">
            <input
              className="input-group__input"
              onChange={handleAddInputChange}
              value={row.model}
              type="text"
              name="model"
              id="model"
              placeholder="&nbsp;"
              autoComplete="off"
              required
            />
            <label className="input-group__label">Model</label>
          </div>
          <div className="input-group">
            <input
              className="input-group__input"
              onChange={handleAddInputChange}
              value={row.macAddress}
              type="text"
              name="macAddress"
              id="macAddress"
              placeholder="&nbsp;"
              autoComplete="off"
              required
            />
            <label className="input-group__label">Mac Address</label>
          </div>
          <div className="input-group">
            <input
              className="input-group__input"
              onChange={handleAddInputChange}
              value={row.description}
              type="text"
              name="description"
              id="description"
              placeholder="&nbsp;"
              autoComplete="off"
              required
            />
            <label className="input-group__label">Description</label>
          </div>
        </div>
        <div className="modal__container__select">
          <button
            className="modal__container__select__btn-save"
            onClick={onAdd}
          >
            Save
          </button>

          <button
            className="modal__container__select__btn-cancel"
            onClick={handleCancelInputChange}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <ErrorBoundary>
      <motion.div {...devicePageAnimation} className="device-page">
        <div className="device-page__content">
          <div className="_title">
            {DevicePageHeader()}
            {DevicePageSearchbar()}
            <span>Devices:{newData.length}</span>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="device-page__content__table">
              {TableHeader()}
              {DevicePageTableBody(loading, filtered)}
            </table>
          )}
          <motion.div {...paginationAnimation} className="pagination">
            <ul className="page-numbers">
              {DevicePagePreviousBtn()}
              {pageDecrementBtn}
              {renderPageNumbers}
              {pageIncrementBtn}
              {DevicePageNextBtn()}
            </ul>
          </motion.div>
        </div>
        <AnimatePresence> {isVisible && Modal()}</AnimatePresence>
      </motion.div>
    </ErrorBoundary>
  );
}

export default App;
