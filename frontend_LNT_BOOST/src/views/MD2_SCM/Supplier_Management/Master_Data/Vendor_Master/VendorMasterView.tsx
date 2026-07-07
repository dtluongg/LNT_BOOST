import { useState, useEffect } from 'react';
import VendorListView from './VendorListView';
import VendorFormView from './VendorFormView';
import { vendorApi } from './vendorApi';
import './VendorMaster.css';

interface VendorData {
  vendorID: string;
  vendorCode: string;
  vendorName: string;
  activeFlag: boolean;
  vendorGroupID: string;
  companyName: string;
  phoneNo: string;
  fax: string;
  web: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  contactSalutation: string;
  contactPersonName: string;
  contactInitials: string;
  contactPhone1: string;
  contactPhone2: string;
  contactEmail: string;
  vendorClass: string;
  vendorCertificates: string;
  currency: string;
  paymentTerm: string;
  paymentReference: string;
  isSameAsMainContact: boolean;
  remitSalutation: string;
  remitPersonName: string;
  remitPosition: string;
  remitPhone1: string;
  remitPhone2: string;
  remitEmail: string;
  shipperDetailNotes: string;
  purchaseDetailNotes: string;
}

const initialVendorState: VendorData = {
  vendorID: '',
  vendorCode: '',
  vendorName: '',
  activeFlag: true,
  vendorGroupID: '',
  companyName: '',
  phoneNo: '',
  fax: '',
  web: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  province: '',
  postalCode: '',
  country: '',
  contactSalutation: 'Ms',
  contactPersonName: '',
  contactInitials: '',
  contactPhone1: '',
  contactPhone2: '',
  contactEmail: '',
  vendorClass: '',
  vendorCertificates: '',
  currency: '',
  paymentTerm: '',
  paymentReference: '',
  isSameAsMainContact: false,
  remitSalutation: 'Mr',
  remitPersonName: '',
  remitPosition: '',
  remitPhone1: '',
  remitPhone2: '',
  remitEmail: '',
  shipperDetailNotes: '',
  purchaseDetailNotes: ''
};

export default function VendorMasterView() {
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [formMode, setFormMode] = useState<'view' | 'create' | 'edit'>('view');
  const [activeTab, setActiveTab] = useState<'general' | 'shipper' | 'payment' | 'purchase'>('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<VendorData>(initialVendorState);

  // State for loading state
  const [loading, setLoading] = useState(false);

  // Database lists
  const [vendorsList, setVendorsList] = useState<any[]>([]);
  const [vendorGroups, setVendorGroups] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<any[]>([]);
  const [shipperLocations, setShipperLocations] = useState<any[]>([]);


  // Load lookup options and vendors list on mount
  useEffect(() => {
    loadLookupData();
    loadVendors();
  }, []);

  const loadLookupData = async () => {
    try {
      const [groups, ctries, currs, terms] = await Promise.all([
        vendorApi.getVendorGroups(),
        vendorApi.getCountries(),
        vendorApi.getCurrencies(),
        vendorApi.getPaymentTypes()
      ]);
      setVendorGroups(groups);
      setCountries(ctries);
      setCurrencies(currs);
      setPaymentTypes(terms);
    } catch (err: any) {
      console.error('Failed to load lookup catalogs:', err.message);
    }
  };

  const loadVendors = async () => {
    setLoading(true);
    try {
      const data = await vendorApi.getVendors();
      setVendorsList(data);
    } catch (err: any) {
      console.error('Error loading vendor list:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sync remittance contact when checkbox is selected
  useEffect(() => {
    if (formData.isSameAsMainContact) {
      setFormData(prev => ({
        ...prev,
        remitSalutation: prev.contactSalutation,
        remitPersonName: prev.contactPersonName,
        remitPhone1: prev.contactPhone1,
        remitPhone2: prev.contactPhone2,
        remitEmail: prev.contactEmail
      }));
    }
  }, [
    formData.isSameAsMainContact,
    formData.contactSalutation,
    formData.contactPersonName,
    formData.contactPhone1,
    formData.contactPhone2,
    formData.contactEmail
  ]);

  // Handle standard input change events
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  // Switch to Create Mode
  const handleAddNew = () => {
    setFormData({
      ...initialVendorState,
      // Create a transient ID
      vendorID: 'VDC' + Math.floor(10000 + Math.random() * 90000)
    });
    setFormMode('create');
    setViewMode('form');
    setActiveTab('general');
  };

  // Switch to Edit Mode
  const handleEdit = () => {
    setFormMode('edit');
  };

  // Select row from list to view
  const handleSelectRow = async (vendor: VendorData) => {
    setFormData(vendor);
    setFormMode('view');
    setViewMode('form');

    // Gọi API load Shipper Locations
    try {
      const locations = await vendorApi.getShipperLocations(vendor.vendorID);
      setShipperLocations(locations);
    } catch (err) {
      console.error("Failed to load shipper locations", err);
    }


  };

  // Cancel form editing and return to list
  const handleCancel = () => {
    setViewMode('list');
    setFormMode('view');
    loadVendors(); // Refresh the list
  };

  // Save form data to DB
  const handleSave = async () => {
    try {
      if (formMode === 'create') {
        await vendorApi.createVendor(formData);
      } else {
        await vendorApi.updateVendor(formData);
      }
      alert('Vendor data saved successfully!');
      setViewMode('list');
      setFormMode('view');
      loadVendors();
    } catch (err: any) {
      alert('Failed to save vendor data: ' + err.message);
    }
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {loading && viewMode === 'list' && vendorsList.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading records from database...
        </div>
      ) : viewMode === 'list' ? (
        <VendorListView
          vendors={vendorsList}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddNew={handleAddNew}
          onSelectRow={handleSelectRow}
        />
      ) : (
        <VendorFormView
          formData={formData}
          formMode={formMode}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onInputChange={handleInputChange}
          onCancel={handleCancel}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onSave={handleSave}
          vendorGroups={vendorGroups}
          countries={countries}
          currencies={currencies}
          paymentTypes={paymentTypes}
          shipperLocations={shipperLocations}
        // onAddLocation={handleAddLocation}
        // onEditLocation={handleEditLocation}
        />
      )}
    </div>
  );
}
