export const getAdminToken = () => sessionStorage.getItem('adminToken');

export const setAdminToken = (token: string | null) => {
  if (token) {
    sessionStorage.setItem('adminToken', token);
  } else {
    sessionStorage.removeItem('adminToken');
  }
};
