import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showValidationErrorDialog } from '../../redux/actions';

//components
import MaterialCard from '../ui/MaterialCard';
import UIHeader from '../ui/UIHeader';
import DataTableControl from '../ui/DataTableControl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Authorize from '../fragments/Authorize';
import FontAwesomeButton from '../ui/FontAwesomeButton';
import EditNoteFormFields from '../forms/EditNoteFormFields';
import useFormModal from '../hooks/useFormModal';

import moment from 'moment';
import * as api from '../../Api';
import * as Constants from '../../Constants';

const Comments = ({ title, dataList, projectId, noteType, show = 1 }) => {
  const [modalExpand, setModalExpand] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(
      dataList.map((comment) => {
        return { ...comment, noteDate: moment(comment.noteDate).format(Constants.DATE_DISPLAY_FORMAT) };
      })
    );
    //eslint-disable-next-line
  }, []);

  const tableColumns = [
    { heading: 'Date Added', key: 'noteDate', nosort: true },
    { heading: 'User', key: 'userName', nosort: true },
    { heading: 'Comment', key: 'comment', nosort: true, markdown: true },
  ];

  const toggleShowAllModal = () => setModalExpand(!modalExpand);

  const onAddClicked = () => {
    noteFormModal.openForm(Constants.FORM_TYPE.ADD, {
      projectId,
      refreshData: refreshData,
    });
  };

  const onEditClicked = (id) => {
    noteFormModal.openForm(Constants.FORM_TYPE.EDIT, {
      projectId,
      id,
      refreshData: refreshData,
    });
  };

  const onDeleteClicked = (id) => {
    api
      .deleteNote(projectId, id)
      .then(() => {
        refreshData();
      })
      .catch((error) => {
        console.log(error);
        showValidationErrorDialog(error.response.data);
      });
  };

  const handleEditNoteFormSubmit = (values, formType) => {
    if (!noteFormModal.submitting) {
      noteFormModal.setSubmitting(true);
      if (formType === Constants.FORM_TYPE.ADD) {
        api
          .postNote(projectId, { projectId, ...values, noteType })
          .then(() => {
            noteFormModal.closeForm();
            refreshData();
          })
          .catch((error) => {
            console.log(error.response);
            showValidationErrorDialog(error.response.data);
          })
          .finally(() => noteFormModal.setSubmitting(false));
      } else if (formType === Constants.FORM_TYPE.EDIT) {
        api
          .putNote(projectId, values.id, values)
          .then(() => {
            noteFormModal.closeForm();
            refreshData();
          })
          .catch((error) => {
            console.log(error.response);
            showValidationErrorDialog(error.response.data);
          })
          .finally(() => noteFormModal.setSubmitting(false));
      }
    }
  };

  const noteFormModal = useFormModal(title, <EditNoteFormFields />, handleEditNoteFormSubmit, {
    saveCheck: true,
    size: 'lg',
  });

  const refreshData = () => {
    api
      .getNotes(projectId)
      .then((response) => {
        setData(
          response.data
            .filter((note) => note.noteType === noteType)
            .map((comment) => {
              return { ...comment, noteDate: moment(comment.noteDate).format(Constants.DATE_DISPLAY_FORMAT) };
            })
        );
      })
      .catch((error) => {
        console.log(error.response);
        showValidationErrorDialog(error.response.data);
      });
  };

  return (
    <MaterialCard>
      <UIHeader>
        {title}
        <div className="float-right">
          <Authorize requires={Constants.PERMISSIONS.PROJECT_W}>
            <FontAwesomeButton
              icon="plus"
              onClick={onAddClicked}
              iconSize={'lg'}
              title={`Add ${title}`}
              className="mr-2"
            />
          </Authorize>
          <FontAwesomeButton
            icon="expand-alt"
            onClick={toggleShowAllModal}
            iconSize={'lg'}
            title={`Show all ${title}`}
          />
        </div>
      </UIHeader>
      <DataTableControl dataList={data.slice(show * -1)} tableColumns={tableColumns} />

      <Modal isOpen={modalExpand} toggle={toggleShowAllModal} size="lg">
        <ModalHeader toggle={toggleShowAllModal}>{title} History</ModalHeader>
        <ModalBody>
          <DataTableControl
            dataList={[...data].reverse()}
            tableColumns={tableColumns}
            editable
            deletable
            editPermissionName={Constants.PERMISSIONS.PROJECT_W}
            onEditClicked={onEditClicked}
            onDeleteClicked={onDeleteClicked}
            hover={false}
          />
        </ModalBody>
        <ModalFooter>
          <div className="text-right">
            <Button color="primary" onClick={toggleShowAllModal}>
              Close
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      {noteFormModal.formElement}
    </MaterialCard>
  );
};

Comments.propTypes = {
  dataList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  projectId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  show: PropTypes.number, //changes how many comments to show starting from the most recent
};

export default connect(null, { showValidationErrorDialog })(Comments);
