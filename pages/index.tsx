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
import { LoginParamter, Login, CheckPasswordResponse, BankAccount } from '../src/helpers/Login';
import BackupTable from '../src/components/backup-table';
import BankAccountDetail from '../src/components/bank-account-detail';

type HomePageProps = {
  showLoginForm: () => void;
};

const HomePage: NextPage<HomePageProps> = ({ showLoginForm }) => {
  const [showNewModal, setNewModal] = useState(false);
  const [showBackupTable, setShowBackupTable] = useState(false);
  const [showBankAccountDetail, setShowBankAccountDetail] = useState(false);

  const [backupData, setBackupData] = useState([]);
  const [detailBankAccount, setDetailBankAccount] = useState<BankAccount>();

  const [isGeneratePasswordLoading, setIsGeneratePasswordLoading] = useState(false);
  const [isCheckPasswordLoading, setIsCheckPasswordLoading] = useState(false);

  const { data, error, revalidate, isValidating } = useSWR('/api/logins', fetch);
  const {
    data: bankAccountsData,
    error: bankAccountsError,
    revalidate: bankAccountsRevalidate,
    isValidating: bankAccountsIsValidating,
  } = useSWR('/api/bank-accounts', fetch);

  const isLoading =
    (!error && !data) || isValidating || (!bankAccountsError && !bankAccountsData) || bankAccountsIsValidating;

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isBackupsLoading, setIsBackupsLoading] = useState(false);

  const passData = error || !Array.isArray(data) ? [] : data;
  const bankData =
    bankAccountsError || !Array.isArray(bankAccountsData)
      ? []
      : bankAccountsData.map(b => ({
          ...b,
          bankName: b.bank_name,
          bankCode: b.bank_code,
          accountName: b.account_name,
          accountNumber: b.accountNumber,
        }));
  const allData = bankData
    .map(b => ({ id: b.id, url: b.bank_name, username: b.account_name, password: b.password, type: 'bankAccount' }))
    .concat(passData);

  useEffect(() => {
    if (error && hasToken()) {
      message.error(error.message);
    }
  }, [error]);

  const revalidateData = useCallback(() => {
    revalidate();
    bankAccountsRevalidate();
  }, [revalidate, bankAccountsRevalidate]);
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
        revalidateData();
      } catch (e) {
        message.error(e.message);
      }
    },
    [revalidateData],
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
  const getBackups = useCallback(async () => {
    try {
      const backups = await fetch('/api/logins/backup', {
        method: 'GET',
      });
      return backups;
    } catch (e) {
      message.error(e.message);
      return [];
    }
  }, []);
  const onBackupModalClose = useCallback(() => {
    setShowBackupTable(false);
    setBackupData([]);
  }, []);
  const onBankAccountModalClose = useCallback(() => {
    setShowBankAccountDetail(false);
    setDetailBankAccount({} as BankAccount);
  }, []);
  const handleRestore = useCallback(() => {
    setIsBackupsLoading(true);
    setShowBackupTable(true);
    getBackups().then(backups => {
      setBackupData(backups);
      setIsBackupsLoading(false);
    });
  }, [getBackups]);

  const handleBackupSelected = useCallback(
    async (filename: string) => {
      try {
        setIsBackupsLoading(true);
        await fetch('/api/logins/restore', {
          method: 'POST',
          body: JSON.stringify({ name: filename }),
        });
        revalidateData();
        setIsBackupsLoading(false);
        onBackupModalClose();
        message.success('Passwords restored');
      } catch (e) {
        setIsBackupsLoading(false);
        message.error(e.message);
      }
    },
    [revalidateData, onBackupModalClose],
  );

  const handleBankAccountSelected = (id: number | string) => {
    const selectedBank: BankAccount = bankData.find(b => b.id === id);
    setDetailBankAccount(selectedBank);
    setShowBankAccountDetail(true);
  };
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

      if (password && password.message) {
        callback(password.message);
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
        revalidateData();
      } catch (e) {
        message.error(e.message);
      } finally {
        setIsCreateLoading(false);
        actions.setSubmitting(false);
      }
    },
    [revalidateData],
  );

  const onDeletePass = useCallback(
    async (pass: Login) => {
      setIsDeleteLoading(true);
      try {
        await fetch(`/api/logins/${pass.id}`, { method: 'DELETE' });
        message.success('Password deleted');
        revalidateData();
      } catch (e) {
        message.error(e.message);
      }
      setIsDeleteLoading(false);
    },
    [revalidateData],
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
        revalidateData();
      } catch (e) {
        message.error(e.message);
      } finally {
        setIsUpdateLoading(false);
        callback();
      }
    },
    [revalidateData],
  );

  return (
    <div className="app">
      <Header
        loading={isLoading}
        onDataRefresh={revalidateData}
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
          data={allData}
          handleBankAccountSelected={handleBankAccountSelected}
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

      <BackupTable
        data={backupData}
        visible={showBackupTable}
        handleBackupSelected={handleBackupSelected}
        onClose={onBackupModalClose}
        loading={isBackupsLoading}
      />
      <BankAccountDetail
        bankAccount={detailBankAccount}
        visible={showBankAccountDetail}
        onClose={onBankAccountModalClose}
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
