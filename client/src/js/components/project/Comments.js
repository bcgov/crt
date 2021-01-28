import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

//components
import MaterialCard from '../ui/MaterialCard';
import UIHeader from '../ui/UIHeader';
import DataTableControl from '../ui/DataTableControl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormInput } from '../forms/FormInputs';
import { Formik, Form, useField } from 'formik';

import moment from 'moment';
import * as api from '../../Api';

const Comments = ({ title, dataList, projectId, show = 1 }) => {
  const [modalExpand, setModalExpand] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(
      dataList.map((comment) => {
        return { ...comment, noteDate: moment(comment.noteDate).format('YYYY-MMM-DD') };
      })
    );
    //eslint-disable-next-line
  }, []);

  const tableColumns = [
    { heading: 'Date Added', key: 'noteDate', nosort: true },
    { heading: 'User', key: 'userId', nosort: true },
    { heading: 'Comment', key: 'comment', nosort: true },
  ];

  const toggleShowAllModal = () => setModalExpand(!modalExpand);
  const toggleShowAddModal = () => setModalAdd(!modalAdd);

  const handleCommentSubmit = (value) => {
    setSubmitting(true);
    console.log(projectId);
    console.log(value);
    //temporary fix to simulate submitting a comment
    setTimeout(() => {
      setSubmitting(false);
      toggleShowAddModal();
    }, 3000);
    // api
    //   .postNote(1, value)
    //   .then(() => {
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     setSubmitting(false);
    //   });
  };

  return (
    <MaterialCard>
      <UIHeader>{title}</UIHeader>
      <DataTableControl dataList={data.slice(show * -1)} tableColumns={tableColumns} />
      <div className="text-right">
        <Button color="primary" onClick={toggleShowAddModal}>
          Add
        </Button>
        <Button color="primary" onClick={toggleShowAllModal}>
          Expand
        </Button>
      </div>
      <Modal isOpen={modalExpand} toggle={toggleShowAllModal}>
        <ModalHeader toggle={toggleShowAllModal}>{title} History</ModalHeader>
        <ModalBody>
          <DataTableControl dataList={data} tableColumns={tableColumns} />
        </ModalBody>
        <ModalFooter>
          <div className="text-right">
            <Button color="primary" onClick={toggleShowAllModal}>
              Close
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalAdd} toggle={toggleShowAddModal}>
        <ModalHeader toggle={toggleShowAddModal}>Add {title}</ModalHeader>
        <Formik initialValues={{ comment: '' }} onSubmit={handleCommentSubmit}>
          {({ dirty, values }) => (
            <Form>
              <ModalBody>
                <FormInput type="text" name="comment" placeholder="Insert Comment Here" />
              </ModalBody>
              <ModalFooter>
                <div className="text-right">
                  <Button
                    type="submit"
                    color="primary"
                    disabled={!dirty || values.comment.trim().length === 0 || submitting}
                  >
                    Submit
                  </Button>
                  <Button color="secondary" onClick={toggleShowAddModal}>
                    Close
                  </Button>
                </div>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    </MaterialCard>
  );
};

Comments.propTypes = {
  dataList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  projectId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  show: PropTypes.number, //changes how many comments to show starting from the most recent
};

export default Comments;