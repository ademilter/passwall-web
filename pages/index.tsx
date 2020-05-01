import React, { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import { FormikHelpers } from 'formik';
import useSWR from 'swr';
import { message } from 'antd';
import download from 'downloadjs';

import fetch from '../src/libs/fetch';

import PassForm from '../src/components/pass-form';
import Header from '../src/components/header';
import PassTable from '../src/components/table';
import { hasToken } from '../src/utils';
import withLogin from '../src/hoc/withLogin';
import { LoginParamter, Login, CheckPasswordResponse } from '../src/helpers/Login';

type HomePageProps = {
  showLoginForm: () => void;
};

const HomePage: NextPage<HomePageProps> = ({ showLoginForm }) => {
  const [showNewModal, setNewModal] = useState(false);
  const [isGeneratePasswordLoading, setIsGeneratePasswordLoading] = useState(false);
  const [isCheckPasswordLoading, setIsCheckPasswordLoading] = useState(false);

  const { data, error, revalidate, isValidating } = useSWR('/api/logins', fetch);

  const isLoading = (!error && !data) || isValidating;

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const passData = error || !Array.isArray(data) ? [] : data;

  useEffect(() => {
    if (error && hasToken()) {
      message.error(error.message);
    }
  }, [error]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('TOKEN');
    showLoginForm();
  }, [showLoginForm]);

  const handleExport = useCallback(async () => {
    try {
      const file = await fetch('/api/logins/export', {
        method: 'POST',
        text: true,
      });

      download(file, 'passwall.csv', 'text/csv');

      message.success('Passwords exported');
    } catch (e) {
      message.error(e.message);
    }
  }, []);

  const handleImport = useCallback(
    async (file: File) => {
      try {
        const form = new FormData();
        form.append('file', file, 'passwords.csv');
        form.append('url', 'URL');
        form.append('username', 'Username');
        form.append('password', 'Password');

        await fetch('/api/logins/import', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
          },
          body: form,
        });

        message.success('Import successfully');
        revalidate();
      } catch (e) {
        message.error(e.message);
      }
    },
    [revalidate],
  );

  const handleBackup = useCallback(async () => {
    try {
      await fetch('/api/logins/backup', {
        method: 'POST',
      });

      message.success('Passwords backed up');
    } catch (e) {
      message.error(e.message);
    }
  }, []);

  const handleRestore = useCallback(async () => {
    try {
      await fetch('/api/logins/restore', {
        method: 'POST',
      });

      message.success('Passwords restored');
      revalidate();
    } catch (e) {
      message.error(e.message);
    }
  }, [revalidate]);

  const onModalClose = useCallback(() => {
    setNewModal(false);
  }, []);

  const onModalOpen = useCallback(() => {
    setNewModal(true);
  }, []);

  const generatePassword = useCallback(async callback => {
    setIsGeneratePasswordLoading(true);
    try {
      const password = await fetch('/api/logins/generate-password', {
        method: 'POST',
      });

      if (password && password.Message) {
        callback(password.Message);
      } else {
        message.error('There was an error creating the password.');
      }
    } catch (passwordError) {
      message.error(passwordError.message);
    }
    setIsGeneratePasswordLoading(false);
  }, []);
  const onCheckPassword = useCallback(async (pwd: string) => {
    setIsCheckPasswordLoading(true);
    let urls: string[];
    try {
      const response: CheckPasswordResponse = await fetch('/api/logins/check-password', {
        method: 'POST',
        body: JSON.stringify({ password: pwd }),
      });
      urls = response.urls;
    } catch (passwordError) {
      urls = [];
      message.error(passwordError.message);
    }
    setIsCheckPasswordLoading(false);
    return urls;
  }, []);
  const onCreatePass = useCallback(
    async (values: LoginParamter, actions: FormikHelpers<LoginParamter>) => {
      setIsCreateLoading(true);
      try {
        await fetch('/api/logins', {
          method: 'POST',
          body: JSON.stringify(values),
        });
        setNewModal(false);
        message.success('Password added');
        revalidate();
      } catch (e) {
        message.error(e.message);
      } finally {
        setIsCreateLoading(false);
        actions.setSubmitting(false);
      }
    },
    [revalidate],
  );

  const onDeletePass = useCallback(
    async (pass: Login) => {
      setIsDeleteLoading(true);
      try {
        await fetch(`/api/logins/${pass.id}`, { method: 'DELETE' });
        message.success('Password deleted');
        revalidate();
      } catch (e) {
        message.error(e.message);
      }
      setIsDeleteLoading(false);
    },
    [revalidate],
  );

  const onUpdatePass = useCallback(
    async (id: string | number, values: LoginParamter, callback: () => void) => {
      setIsUpdateLoading(true);
      try {
        await fetch(`/api/logins/${id}`, {
          method: 'PUT',
          body: JSON.stringify(values),
        });
        message.success('Password updated');
        revalidate();
      } catch (e) {
        message.error(e.message);
      } finally {
        setIsUpdateLoading(false);
        callback();
      }
    },
    [revalidate],
  );

  return (
    <div className="app">
      <Header
        loading={isLoading}
        onDataRefresh={revalidate}
        onModalOpen={onModalOpen}
        onLogout={handleLogout}
        onExport={handleExport}
        onImport={handleImport}
        onBackup={handleBackup}
        onRestore={handleRestore}
      />

      <div className="app-table">
        <PassTable
          isUpdateLoading={isUpdateLoading}
          isDeleteLoading={isDeleteLoading}
          isCheckPasswordLoading={isCheckPasswordLoading}
          loading={isLoading}
          onDeletePass={onDeletePass}
          onUpdatePass={onUpdatePass}
          onCheckPassword={onCheckPassword}
          data={passData}
        />
      </div>

      <PassForm
        title="New Pass"
        submitText="Save"
        visible={showNewModal}
        loading={isCreateLoading}
        onClose={onModalClose}
        generatePassword={generatePassword}
        onCheckPassword={onCheckPassword}
        onSubmit={onCreatePass}
        isGeneratePasswordLoading={isGeneratePasswordLoading}
        isCheckPasswordLoading={isCheckPasswordLoading}
      />

      <style jsx>
        {`
          .app {
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
          }
          .app-table {
            margin-top: 20px;
          }
        `}
      </style>
    </div>
  );
};

export default withLogin(HomePage);
