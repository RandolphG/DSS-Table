import React, { useState, Fragment, useEffect } from "react";
import ErrorBoundary from "../ErrorBoundary";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  devicePageAnimation,
  devicePageHeaderAnimation,
  headerAnimation,
  tableRowAnimation,
} from "../motionSettings";
import axios from "axios";

const Page = () => {
  const [inEditMode, setInEditMode] = useState({ status: false, rowKey: null });
  const [tempInfo, setRowInfo] = useState();
  const [row, setRow] = useState({
    label: "",
    value: "",
    dss_type: "",
  });

  const options = [{ value: "spd" }, { value: "blf" }];

  const data = [
    {
      key: "1",
      label: "Emergency",
      value: "+385-91-543-9837",
      dss_type: "blf",
    },
    {
      key: "2",
      label: "home",
      value: "+385-91-543-9837",
      dss_type: "spd",
    },
    {
      key: "3",
      label: "school",
      value: "+385-91-543-9837",
      dss_type: "spd",
    },
    {
      key: "4",
      label: "work",
      value: "+385-91-543-9837",
      dss_type: "spd",
    },
  ];

  let sourceElement = null;

  const [sortedList, setSortedList] = useState(data);
  const [loading, setLoading] = useState(true);

  async function getDssData() {
    setLoading(true);
    axios
      .get("http://localhost:4001/api/dss?(deviceId)", {
        headers: {
          Authorization: "Token 123",
          "Content-Type": "application/json",
        },
      })
      .then((res) => console.log(`SUCCESS`, res))
      .catch((error) => {
        console.log(`Axios API Get DSS error...`, { error: error.message });
      });

    return await axios
      .get("./config/dssInfo.json")
      .then((res) => {
        // setSortedList(res.data.dss_buttons);
        return res.data;
      })
      .then((res) => {
        setLoading(false);
        console.log(`Axios Json`, res.dss_buttons);
      })
      .catch((error) => {
        console.log(`nothing there...`, { error: error.message });
      });
  }

  useEffect(() => {
    const response = getDssData();
    console.log(`dss data retrieved : `, response);
  }, []);

  function handleInputChange(event) {
    setRowInfo({
      ...tempInfo,
      [event.target.name]: event.target.value,
    });
  }

  function onEdit({ key }) {
    setRowInfo(sortedList.find((item) => item.key === key));
    setInEditMode({ status: true, rowKey: key });
  }

  function onCancel() {
    setInEditMode({ status: false, rowKey: null });
  }

  function onSave() {
    setInEditMode({ status: false, rowKey: null });
    const data = sortedList.map((item) =>
      item.key === tempInfo.key ? tempInfo : item
    );

    axios
      .put("http://localhost:4001/api/dss/(dssid)", {
        headers: {
          Authorization: "Token 123",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then(() => console.log(`SUCCESS`))
      .catch((error) => {
        console.log(`Edit error...`, { error: error.message });
      });

    setSortedList(data);
  }

  function onDelete(index) {
    sortedList.splice(index, 1);
    const data = sortedList.map((item) =>
      item.key === sortedList.key ? sortedList : item
    );

    axios
      .delete("http://localhost:4001/api/dss/(dssid)", {
        headers: {
          Authorization: "Token 123",
          "Content-Type": "application/json",
        },
      })
      .then(() => console.log(`SUCCESS`))
      .catch((error) => {
        console.log(`DSS Delete error...`, { error: error.message });
      });

    setSortedList(data);
  }

  /* add a new entry at the end of the list.  */
  const addNewEntry = () => {
    console.log(sortedList);
    const key = sortedList.length + 1;
    const dssEntry = {
      key: key.toString(),
      label: row.label,
      value: row.value,
      dss_type: row.dss_type,
    };

    setSortedList(sortedList.concat(dssEntry));

    /* some device number goes here */
    dssEntry.device = key.toString();

    axios
      .post("http://localhost:4001/api/dss", {
        headers: {
          Authorization: "Token 123",
          "Content-Type": "application/json",
        },

        body: JSON.stringify(dssEntry),
      })
      .then(() => console.log(`SUCCESS`))
      .catch((error) => {
        console.log(`Create DSS Entry error...`, { error: error.message });
      });
  };

  /* change opacity for the dragged item.
    remember the source item for the drop later */
  const handleDragStart = (event) => {
    event.target.style.opacity = 0.5;
    sourceElement = event.target;
    event.dataTransfer.effectAllowed = "move";
  };

  /* do not trigger default event of item while passing (e.g. a link) */
  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  /* add class .over while hovering other items */
  const handleDragEnter = (event) => {
    event.target.classList.add("over");
  };

  /* remove class .over when not hovering over an item anymore*/
  const handleDragLeave = (event) => {
    event.target.classList.remove("over");
  };

  const handleDrop = (event) => {
    /* prevent redirect in some browsers*/
    event.stopPropagation();

    /* only do something if the dropped on item is
        different to the dragged item*/
    if (sourceElement !== event.target) {
      /* remove dragged item from list */
      const list = sortedList.filter(
        (item, i) => i.toString() !== sourceElement.id
      );

      /* this is the removed item */
      const removed = sortedList.filter(
        (item, i) => i.toString() === sourceElement.id
      )[0];

      /* insert removed item after this number. */
      let insertAt = Number(event.target.id);

      console.log("list with item removed", list);
      console.log("removed:  line", removed);
      console.log("insertAt index", insertAt);

      let tempList = [];

      /* if dropped at last item, don't increase target id by +1.
               max-index is arr.length */
      if (insertAt >= data.length) {
        tempList = data.slice(0).concat(removed);
        setSortedList(tempList);
        event.target.classList.remove("over");
      } else if (insertAt < data.length) {
        /* original list without removed item until the index it was removed at */
        tempList = data.slice(0, insertAt).concat(removed);

        console.log("tempList", tempList);
        console.log("insert the rest: ", list.slice(insertAt));

        /* add the remaining items to the list */
        const newList = tempList.concat(data.slice(insertAt));
        console.log("newList", newList);

        /* set state to display on page */
        setSortedList(newList);
        event.target.classList.remove("over");
      }
    } else console.log("nothing happened");
    event.target.classList.remove("over");
  };

  const handleDragEnd = (event) => {
    event.target.style.opacity = 1;
    console.log(
      "-------------------------------------------------------------"
    );
  };

  /* create list of items */
  const listItems = () => {
    return (
      <ErrorBoundary>
        {sortedList &&
          sortedList.map(({ label, key, value, dss_type }, index) => {
            return (
              <motion.div {...tableRowAnimation} className="tbody" key={index}>
                <div
                  id={index}
                  className="tbody__tr"
                  draggable={true}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                >
                  <div className="tbody__tr__td-key">{key}</div>
                  <div className="tbody__tr__td-label">
                    {inEditMode.status && inEditMode.rowKey === key ? (
                      <input
                        className="input-label"
                        type="text"
                        name="label"
                        id="label"
                        value={tempInfo.label}
                        onChange={(event) => handleInputChange(event)}
                      />
                    ) : (
                      label
                    )}
                  </div>
                  <div className="tbody__tr__td-value">
                    {inEditMode.status && inEditMode.rowKey === key ? (
                      <input
                        className="input-value"
                        type="text"
                        name="value"
                        id="value"
                        value={tempInfo.value}
                        onChange={(event) => handleInputChange(event)}
                      />
                    ) : (
                      value
                    )}
                  </div>
                  <div className="tbody__tr__td-dss_type">
                    {inEditMode.status && inEditMode.rowKey === key ? (
                      <select
                        className="tbody__tr__td-dss_type__select"
                        name="dss_type"
                        id="dss_type"
                        value={tempInfo.dss_type}
                        onChange={(event) => handleInputChange(event)}
                      >
                        {options &&
                          options.map(({ value }, idx) => (
                            <option
                              className="tbody__tr__td-dss_type__select_option"
                              key={`selection-${idx}`}
                              value={value}
                            >
                              {value}
                            </option>
                          ))}
                      </select>
                    ) : (
                      dss_type
                    )}
                  </div>
                  <div className="actions">
                    {inEditMode.status && inEditMode.rowKey === key ? (
                      <Fragment>
                        <button className="btn-save" onClick={onSave}>
                          Save
                        </button>

                        <button className="btn-cancel" onClick={onCancel}>
                          Cancel
                        </button>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <button
                          className="btn-edit"
                          onClick={() => onEdit({ key, sortedList })}
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
                  </div>
                </div>
              </motion.div>
            );
          })}
      </ErrorBoundary>
    );
  };

  const tableheader = () => (
    <div className="dss-device-page__content_page">
      <div className="dss-device-page__content_page__tr">
        <motion.div
          {...headerAnimation}
          className="dss-device-page__content_page__tr_th-key"
        >
          key
        </motion.div>
        <motion.div
          {...headerAnimation}
          className="dss-device-page__content_page__tr_th-label"
        >
          label
        </motion.div>
        <motion.div
          {...headerAnimation}
          className="dss-device-page__content_page__tr_th-value"
        >
          value
        </motion.div>
        <motion.div
          {...headerAnimation}
          className="dss-device-page__content_page__tr_th-type"
        >
          type
        </motion.div>
      </div>
    </div>
  );

  const title = () => (
    <div className="dss-device-page__content_page-title">
      <motion.h1 {...devicePageHeaderAnimation}>DSS Page</motion.h1>
      <Link className="dss-device-page__content_page-title__back-link" to="/">
        <h4>Back</h4>
      </Link>
    </div>
  );

  const addButton = () => (
    <button className="addButton" onClick={addNewEntry}>
      +
    </button>
  );

  return (
    <motion.div className="dss-device-page" {...devicePageAnimation}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="dss-device-page__content">
          {title()}
          {tableheader()}
          {listItems()}
          {addButton()}
        </div>
      )}
    </motion.div>
  );
};

export default Page;
