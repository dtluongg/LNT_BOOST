import { apiFetch } from '../../../../../core/api/httpClient';

// Helper utility to normalize PascalCase keys from Dapper SQL Gateway to camelCase frontend types
function mapKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(mapKeysToCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      let camelKey = key.charAt(0).toLowerCase() + key.slice(1);

      // Standardize suffix "Id" to "ID"
      if (camelKey.endsWith('Id') && camelKey !== 'isNewUser') {
        camelKey = camelKey.slice(0, -2) + 'ID';
      }
      // Special mappings for specific DTO cases:
      if (camelKey === 'companySiteId') camelKey = 'companySiteID';
      if (camelKey === 'companyId') camelKey = 'companyID';
      if (camelKey === 'moduleMasterId') camelKey = 'moduleMasterID';
      if (camelKey === 'menuGroupId') camelKey = 'menuGroupID';
      if (camelKey === 'menuFunctionId') camelKey = 'menuFunctionID';
      if (camelKey === 'menuFilterId') camelKey = 'menuFilterID';
      if (camelKey === 'defaultCompanyId') camelKey = 'defaultCompanyID';

      newObj[camelKey] = mapKeysToCamelCase(obj[key]);
    }
    return newObj;
  }
  return obj;
}

export const vendorApi = {
  getVendors: async (): Promise<any[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({ queryName: 'GetVendors' })
    });
    return mapKeysToCamelCase(raw);
  },

  getVendorGroups: async (): Promise<any[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({ queryName: 'GetVendorGroups' })
    });
    return mapKeysToCamelCase(raw);
  },

  getCountries: async (): Promise<any[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({ queryName: 'GetCountries' })
    });
    return mapKeysToCamelCase(raw);
  },

  getCurrencies: async (): Promise<any[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({ queryName: 'GetCurrencies' })
    });
    return mapKeysToCamelCase(raw);
  },

  getPaymentTypes: async (): Promise<any[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({ queryName: 'GetPaymentTypes' })
    });
    return mapKeysToCamelCase(raw);
  },

  createVendor: async (vendor: any): Promise<any> => {
    return apiFetch<any>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({
        queryName: 'CreateVendor',
        parameters: {
          VendorID: vendor.vendorID,
          VendorCode: vendor.vendorCode,
          VendorName: vendor.vendorName,
          VendorGroupID: vendor.vendorGroupID,
          CompanyName: vendor.companyName,
          PhoneNo: vendor.phoneNo,
          Fax: vendor.fax,
          Web: vendor.web,
          AddressLine1: vendor.addressLine1,
          AddressLine2: vendor.addressLine2,
          City: vendor.city,
          Province: vendor.province,
          PostalCode: vendor.postalCode,
          Country: vendor.country,
          VendorClass: vendor.vendorClass,
          VendorCertificates: vendor.vendorCertificates,
          ContactSalutation: vendor.contactSalutation,
          ContactPersonName: vendor.contactPersonName,
          ContactInitials: vendor.contactInitials,
          ContactPhone1: vendor.contactPhone1,
          ContactPhone2: vendor.contactPhone2,
          ContactEmail: vendor.contactEmail,
          Currency: vendor.currency,
          PaymentTerm: vendor.paymentTerm,
          PaymentReference: vendor.paymentReference,
          IsSameAsMainContact: vendor.isSameAsMainContact ? 1 : 0,
          RemitSalutation: vendor.remitSalutation,
          RemitPersonName: vendor.remitPersonName,
          RemitPosition: vendor.remitPosition,
          RemitPhone1: vendor.remitPhone1,
          RemitPhone2: vendor.remitPhone2,
          RemitEmail: vendor.remitEmail,
          ActiveFlag: vendor.activeFlag ? 1 : 0
        }
      })
    });
  },

  updateVendor: async (vendor: any): Promise<any> => {
    return apiFetch<any>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({
        queryName: 'UpdateVendor',
        parameters: {
          VendorID: vendor.vendorID,
          VendorCode: vendor.vendorCode,
          VendorName: vendor.vendorName,
          VendorGroupID: vendor.vendorGroupID,
          CompanyName: vendor.companyName,
          PhoneNo: vendor.phoneNo,
          Fax: vendor.fax,
          Web: vendor.web,
          AddressLine1: vendor.addressLine1,
          AddressLine2: vendor.addressLine2,
          City: vendor.city,
          Province: vendor.province,
          PostalCode: vendor.postalCode,
          Country: vendor.country,
          VendorClass: vendor.vendorClass,
          VendorCertificates: vendor.vendorCertificates,
          ContactSalutation: vendor.contactSalutation,
          ContactPersonName: vendor.contactPersonName,
          ContactInitials: vendor.contactInitials,
          ContactPhone1: vendor.contactPhone1,
          ContactPhone2: vendor.contactPhone2,
          ContactEmail: vendor.contactEmail,
          Currency: vendor.currency,
          PaymentTerm: vendor.paymentTerm,
          PaymentReference: vendor.paymentReference,
          IsSameAsMainContact: vendor.isSameAsMainContact ? 1 : 0,
          RemitSalutation: vendor.remitSalutation,
          RemitPersonName: vendor.remitPersonName,
          RemitPosition: vendor.remitPosition,
          RemitPhone1: vendor.remitPhone1,
          RemitPhone2: vendor.remitPhone2,
          RemitEmail: vendor.remitEmail,
          ActiveFlag: vendor.activeFlag ? 1 : 0
        }
      })
    });
  },

  // deleteVendor: async (vendor: any): Promise<any> => {
  //   return apiFetch<any>('/SqlGateway/query', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       queryName: 'DeleteVendor',
  //       parameters: {
  //         VendorID: vendor.vendorID,
  //       }
  //     })
  //   });
  // }


   // Lấy danh sách địa điểm của Vendor
  getShipperLocations: async (vendorID: string): Promise<any[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({
        queryName: 'GetShipperLocations',
        parameters: { VendorID: vendorID }
      })
    });
    return mapKeysToCamelCase(raw);
  },
  // Lưu địa điểm (Thêm mới/Cập nhật)
  saveShipperLocation: async (location: any): Promise<any> => {
    return apiFetch<any>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({
        queryName: location.locationID ? 'UpdateShipperLocation' : 'CreateShipperLocation',
        parameters: { ...location }
      })
    });
  }


};
