import React, { useState } from 'react';
import { Plus, Save, Trash2, RotateCw } from 'lucide-react';

interface ShipperDetailTabProps {
    formData: any;
    isView: boolean;
    isEdit: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    shipperLocations: any[];
    deliveryModes: any[];
    shippingFOBPoints: any[];
    shippingTerms: any[];
    deliveryTerms: any[];
    countries: any[];
    onSaveLocation: (location: any) => Promise<void>;
    onDeleteLocation: (locationID: number) => Promise<void>;
    onReloadLocations?: (vendorID: string) => Promise<void>;
}

interface LocationFormState {
    locationID?: number;
    locationName: string;
    contractPersonTitle: string;
    contractPersonName: string;
    contractPersonPosition: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    province: string;
    postalcode: string;
    countryID: string;
    phoneNo: string;
    fax: string;
    email: string;
    termOfDelivery: string;
    portOfLoading: string;
    defaultLocationflag: boolean;
    activeflag: boolean;
}

const initialFormState: LocationFormState = {
    locationName: '',
    contractPersonTitle: 'Mr',
    contractPersonName: '',
    contractPersonPosition: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalcode: '',
    countryID: '',
    phoneNo: '',
    fax: '',
    email: '',
    termOfDelivery: '',
    portOfLoading: '',
    defaultLocationflag: false,
    activeflag: true,
};

export default function ShipperDetailTab({
    formData,
    isView,
    isEdit,
    onInputChange,
    shipperLocations = [],
    deliveryModes = [],
    shippingFOBPoints = [],
    shippingTerms = [],
    deliveryTerms = [],
    countries = [],
    onSaveLocation,
    onDeleteLocation,
    onReloadLocations
}: ShipperDetailTabProps) {

    // Local state for the Location Input Form
    const [locationForm, setLocationForm] = useState<LocationFormState>(initialFormState);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Local states for the table filters
    const [filterDeliveryTerm, setFilterDeliveryTerm] = useState<string>('All');
    const [filterPortOfLoading, setFilterPortOfLoading] = useState<string>('');
    const [filterDefault, setFilterDefault] = useState<string>('All');
    const [filterActive, setFilterActive] = useState<string>('All');

    // Handle local form input changes
    const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setLocationForm(prev => ({
            ...prev,
            [name]: val
        }));
    };

    // Clear / Reset form
    const handleClearForm = () => {
        setLocationForm(initialFormState);
    };

    const handleAddNewClick = () => {
        handleClearForm();
        setIsFormOpen(true);
    };

    const handleRowDoubleClick = (loc: any) => {
        handleRowClick(loc);
        setIsFormOpen(true);
    };

    // Copy data from vendor general contact info
    const handleCopyFromVendor = () => {
        setLocationForm(prev => ({
            ...prev,
            locationName: formData.companyName || '',
            contractPersonTitle: formData.contactSalutation || 'Mr',
            contractPersonName: formData.contactPersonName || '',
            contractPersonPosition: formData.contactInitials || '',
            addressLine1: formData.addressLine1 || '',
            addressLine2: formData.addressLine2 || '',
            city: formData.city || '',
            province: formData.province || '',
            postalcode: formData.postalCode || '',
            countryID: formData.country || '',
            phoneNo: formData.phoneNo || '',
            fax: formData.fax || '',
            email: formData.contactEmail || '',
        }));
    };

    // Click on table row to populate form for editing
    const handleRowClick = (loc: any) => {
        setLocationForm({
            locationID: loc.locationID,
            locationName: loc.locationName || '',
            contractPersonTitle: loc.contractPersonTitle || 'Mr',
            contractPersonName: loc.contractPersonName || '',
            contractPersonPosition: loc.contractPersonPosition || '',
            addressLine1: loc.addressLine1 || '',
            addressLine2: loc.addressLine2 || '',
            city: loc.city || '',
            province: loc.province || '',
            postalcode: loc.postalcode || '',
            countryID: loc.countryID || '',
            phoneNo: loc.phoneNo || '',
            fax: loc.fax || '',
            email: loc.email || '',
            termOfDelivery: loc.termOfDelivery || '',
            portOfLoading: loc.portOfLoading || '',
            defaultLocationflag: !!loc.defaultLocationflag,
            activeflag: !!loc.activeflag,
        });
    };

    // Save/Update location
    const handleSaveClick = async () => {
        if (!locationForm.locationName.trim()) {
            alert('Please enter Location Name.');
            return;
        }
        if (!locationForm.addressLine1.trim()) {
            alert('Please enter Address Line 1.');
            return;
        }
        if (!locationForm.city.trim()) {
            alert('Please enter City.');
            return;
        }
        if (!locationForm.province.trim()) {
            alert('Please enter Province.');
            return;
        }
        if (!locationForm.countryID) {
            alert('Please select Country.');
            return;
        }
        if (!locationForm.phoneNo.trim()) {
            alert('Please enter Phone No.');
            return;
        }

        try {
            await onSaveLocation(locationForm);
            alert('Shipper location saved successfully!');
            handleClearForm();
            setIsFormOpen(false);
        } catch (err: any) {
            alert('Failed to save location: ' + err.message);
        }
    };

    // Delete location
    const handleDeleteClick = async () => {
        if (!locationForm.locationID) return;
        if (!window.confirm('Are you sure you want to delete this shipper location?')) return;
        try {
            await onDeleteLocation(locationForm.locationID);
            alert('Shipper location deleted successfully!');
            handleClearForm();
            setIsFormOpen(false);
        } catch (err: any) {
            alert('Failed to delete location: ' + err.message);
        }
    };

    // Refresh locations list
    const handleRefresh = async () => {
        if (onReloadLocations && formData.vendorID) {
            try {
                await onReloadLocations(formData.vendorID);
                alert('Locations list refreshed!');
            } catch (err: any) {
                alert('Failed to refresh locations: ' + err.message);
            }
        }
    };

    // Filter local logic for display
    const filteredLocations = shipperLocations.filter(loc => {
        if (filterDeliveryTerm !== 'All' && loc.termOfDelivery !== filterDeliveryTerm) return false;
        if (filterPortOfLoading && !loc.portOfLoading?.toLowerCase().includes(filterPortOfLoading.toLowerCase())) return false;

        if (filterDefault === 'Yes' && !loc.defaultLocationflag) return false;
        if (filterDefault === 'No' && loc.defaultLocationflag) return false;

        if (filterActive === 'Yes' && !loc.activeflag) return false;
        if (filterActive === 'No' && loc.activeflag) return false;

        return true;
    });

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* MINI TOOLBAR */}
            <div style={{
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
                padding: '4px 10px',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-secondary)'
            }}>
                <button
                    type="button"
                    onClick={handleAddNewClick}
                    disabled={isView}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-primary)',
                        cursor: isView ? 'not-allowed' : 'pointer'
                    }}
                    title="Create New Location"
                >
                    <Plus size={14} />
                </button>

                <button
                    type="button"
                    onClick={handleDeleteClick}
                    disabled={isView || !locationForm.locationID}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-primary)',
                        cursor: (isView || !locationForm.locationID) ? 'not-allowed' : 'pointer',
                        opacity: !locationForm.locationID ? 0.5 : 1
                    }}
                    title="Delete Location"
                >
                    <Trash2 size={14} />
                </button>

                <button
                    type="button"
                    onClick={handleRefresh}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-primary)',
                        cursor: 'pointer'
                    }}
                    title="Refresh Locations"
                >
                    <RotateCw size={14} />
                </button>
            </div>

            {/* SHIPPER LOCATION CONTACT MODAL */}
            {isFormOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-premium)',
                        width: '800px',
                        maxWidth: '95%',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 16px',
                            borderBottom: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-tertiary)'
                        }}>
                            <div style={{ fontWeight: 'bold', fontSize: '12.5px', color: 'var(--text-main)' }}>
                                {locationForm.locationID ? `Edit Shipper Location: #${locationForm.locationID}` : 'Create New Shipper Location'}
                            </div>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    style={{ fontSize: '10.5px', padding: '2px 8px', height: '22px' }}
                                    onClick={handleCopyFromVendor}
                                    disabled={isView}
                                >
                                    Copy from Vendor Contact
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    style={{ fontSize: '10.5px', padding: '2px 8px', height: '22px' }}
                                    onClick={handleClearForm}
                                    disabled={isView}
                                >
                                    Clear Text
                                </button>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    style={{ fontSize: '10.5px', padding: '2px 12px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    onClick={handleSaveClick}
                                    disabled={isView}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    style={{ fontSize: '10.5px', padding: '2px 8px', height: '22px', backgroundColor: 'var(--border-color)', color: 'var(--text-main)' }}
                                    onClick={() => setIsFormOpen(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* TWO-COLUMN FORM LAYOUT */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                                {/* LEFT COLUMN: CONTACT DETAILS */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

                                    {/* ROW 1: Location ID & Location Name */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '100px 60px 1fr', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontWeight: 600, fontSize: '11px' }}>Location ID</span>
                                        <input
                                            type="text"
                                            value={locationForm.locationID ?? '0'}
                                            disabled
                                            className="erp-input"
                                            style={{ height: '22px', fontSize: '11px', backgroundColor: 'var(--bg-tertiary)', textAlign: 'center' }}
                                        />
                                        <input
                                            type="text"
                                            name="locationName"
                                            value={locationForm.locationName || ''}
                                            onChange={handleFormInputChange}
                                            className="erp-input"
                                            disabled={isView}
                                            placeholder="Location Name (Required)"
                                            style={{ height: '22px', fontSize: '11px' }}
                                            required
                                        />
                                    </div>

                                    {/* ROW 2: Person Name */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '100px 60px 1fr 1fr', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontWeight: 600, fontSize: '11px' }}>Person Name</span>
                                        <select
                                            name="contractPersonTitle"
                                            value={locationForm.contractPersonTitle || 'Mr'}
                                            onChange={handleFormInputChange}
                                            className="erp-select"
                                            disabled={isView}
                                            style={{ height: '22px', fontSize: '11px', padding: '2px' }}
                                        >
                                            <option value="Mr">Mr</option>
                                            <option value="Ms">Ms</option>
                                            <option value="Mrs">Mrs</option>
                                        </select>
                                        <input
                                            type="text"
                                            name="contractPersonName"
                                            value={locationForm.contractPersonName || ''}
                                            onChange={handleFormInputChange}
                                            className="erp-input"
                                            disabled={isView}
                                            placeholder="Name"
                                            style={{ height: '22px', fontSize: '11px' }}
                                        />
                                        <input
                                            type="text"
                                            name="contractPersonPosition"
                                            value={locationForm.contractPersonPosition || ''}
                                            onChange={handleFormInputChange}
                                            className="erp-input"
                                            disabled={isView}
                                            placeholder="Position"
                                            style={{ height: '22px', fontSize: '11px' }}
                                        />
                                    </div>

                                    {/* ROW 3: Phone No. & Fax */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 30px 1fr', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontWeight: 600, fontSize: '11px' }}>Phone No.</span>
                                        <input
                                            type="text"
                                            name="phoneNo"
                                            value={locationForm.phoneNo || ''}
                                            onChange={handleFormInputChange}
                                            className="erp-input"
                                            disabled={isView}
                                            placeholder="Phone No (Required)"
                                            style={{ height: '22px', fontSize: '11px' }}
                                            required
                                        />
                                        <span style={{ fontWeight: 600, fontSize: '11px', textAlign: 'right' }}>Fax</span>
                                        <input
                                            type="text"
                                            name="fax"
                                            value={locationForm.fax || ''}
                                            onChange={handleFormInputChange}
                                            className="erp-input"
                                            disabled={isView}
                                            placeholder="Fax"
                                            style={{ height: '22px', fontSize: '11px' }}
                                        />
                                    </div>

                                    {/* ROW 4: Email */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontWeight: 600, fontSize: '11px' }}>Email</span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={locationForm.email || ''}
                                            onChange={handleFormInputChange}
                                            className="erp-input"
                                            disabled={isView}
                                            placeholder="Email address"
                                            style={{ height: '22px', fontSize: '11px' }}
                                        />
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: ADDRESS DETAILS */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

                                    {/* ROW 1: Address Line 1 */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontWeight: 600, fontSize: '11px' }}>Address Line 1</span>
                                        <input
                                            type="text"
                                            name="addressLine1"
                                            value={locationForm.addressLine1 || ''}
                                            onChange={handleFormInputChange}
                                            className="erp-input"
                                            disabled={isView}
                                            placeholder="Address Line 1 (Required)"
                                            style={{ height: '22px', fontSize: '11px' }}
                                            required
                                        />
                                    </div>

                                    {/* ROW 2: Address Line 2 */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontWeight: 600, fontSize: '11px' }}>Address Line 2</span>
                                        <input
                                            type="text"
                                            name="addressLine2"
                                            value={locationForm.addressLine2 || ''}
                                            onChange={handleFormInputChange}
                                            className="erp-input"
                                            disabled={isView}
                                            placeholder="Address Line 2"
                                            style={{ height: '22px', fontSize: '11px' }}
                                        />
                                    </div>

                                    {/* ROW 3: City & Province */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 60px 1fr', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontWeight: 600, fontSize: '11px' }}>City</span>
                                        <input
                                            type="text"
                                            name="city"
                                            value={locationForm.city || ''}
                                            onChange={handleFormInputChange}
                                            className="erp-input"
                                            disabled={isView}
                                            placeholder="City (Required)"
                                            style={{ height: '22px', fontSize: '11px' }}
                                            required
                                        />
                                        <span style={{ fontWeight: 600, fontSize: '11px', textAlign: 'right' }}>Province</span>
                                        <input
                                            type="text"
                                            name="province"
                                            value={locationForm.province || ''}
                                            onChange={handleFormInputChange}
                                            className="erp-input"
                                            disabled={isView}
                                            placeholder="Province (Required)"
                                            style={{ height: '22px', fontSize: '11px' }}
                                            required
                                        />
                                    </div>

                                    {/* ROW 4: Country & Postal Code */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 70px 1fr', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontWeight: 600, fontSize: '11px' }}>Country</span>
                                        <select
                                            name="countryID"
                                            value={locationForm.countryID || ''}
                                            onChange={handleFormInputChange}
                                            className="erp-select"
                                            disabled={isView}
                                            style={{ height: '22px', fontSize: '11px', padding: '2px' }}
                                        >
                                            <option value="">-- Select --</option>
                                            {countries.map(c => (
                                                <option key={c.countryID} value={c.countryID}>
                                                    {c.countryName}
                                                </option>
                                            ))}
                                        </select>
                                        <span style={{ fontWeight: 600, fontSize: '11px', textAlign: 'right' }}>Postal code</span>
                                        <input
                                            type="text"
                                            name="postalcode"
                                            value={locationForm.postalcode || ''}
                                            onChange={handleFormInputChange}
                                            className="erp-input"
                                            disabled={isView}
                                            placeholder="Postal code"
                                            style={{ height: '22px', fontSize: '11px' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* LOGISTICS & STATUS ROW */}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '24px',
                                alignItems: 'center',
                                padding: '8px 12px',
                                fontSize: '11px',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                backgroundColor: 'var(--bg-tertiary)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontWeight: 600, fontSize: '11px' }}>Term Of Delivery</span>
                                    <select
                                        name="termOfDelivery"
                                        value={locationForm.termOfDelivery || ''}
                                        onChange={handleFormInputChange}
                                        className="erp-select"
                                        disabled={isView}
                                        style={{ width: '150px', height: '22px', fontSize: '11px' }}
                                    >
                                        <option value="">-- Select --</option>
                                        {deliveryTerms.map(dt => (
                                            <option key={dt.deliveryTermCode} value={dt.deliveryTermCode}>
                                                {dt.deliveryTermCode} - {dt.description}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontWeight: 600, fontSize: '11px' }}>Port Of Loading</span>
                                    <input
                                        type="text"
                                        name="portOfLoading"
                                        value={locationForm.portOfLoading || ''}
                                        onChange={handleFormInputChange}
                                        className="erp-input"
                                        disabled={isView}
                                        placeholder="Port Of Loading"
                                        style={{ width: '180px', height: '22px', fontSize: '11px' }}
                                    />
                                </div>

                                <label className="checkbox-container" style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', margin: 0 }}>
                                    <input
                                        type="checkbox"
                                        name="defaultLocationflag"
                                        checked={locationForm.defaultLocationflag}
                                        onChange={handleFormInputChange}
                                        disabled={isView}
                                    />
                                    <span style={{ fontWeight: 600, fontSize: '11px' }}>Is Default Location</span>
                                </label>

                                <label className="checkbox-container" style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', margin: 0 }}>
                                    <input
                                        type="checkbox"
                                        name="activeflag"
                                        checked={locationForm.activeflag}
                                        onChange={handleFormInputChange}
                                        disabled={isView}
                                    />
                                    <span style={{ fontWeight: 600, fontSize: '11px' }}>Active Flag</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SECTION 1: SHIPPING INSTRUCTIONS */}
            <div className="erp-card" style={{ maxWidth: '450px', padding: '12px' }}>
                <h4 className="erp-card-title">Shipping Instructions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>Shipping Terms</label>
                        <select
                            name="shippingTerms"
                            value={formData.shippingTerms || ''}
                            onChange={onInputChange}
                            disabled={isView}
                            className="erp-select"
                        >
                            <option value="">-- Select Shipping Term --</option>
                            {shippingTerms.map((term) => (
                                <option key={term.shippingTermCode} value={term.shippingTermCode}>
                                    {term.description}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>Delivery Mode</label>
                        <select
                            name="deliveryMode"
                            value={formData.deliveryMode || ''}
                            onChange={onInputChange}
                            disabled={isView}
                            className="erp-select"
                        >
                            <option value="">-- Select Delivery Mode --</option>
                            {deliveryModes.map((dMode) => (
                                <option key={dMode.deliveryModeCode} value={dMode.deliveryModeCode}>
                                    {dMode.description}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>FOB Point</label>
                        <select
                            name="fobPoint"
                            value={formData.fobPoint || ''}
                            onChange={onInputChange}
                            disabled={isView}
                            className="erp-select"
                        >
                            <option value="">-- Select FOB Point --</option>
                            {shippingFOBPoints.map((fob) => (
                                <option key={fob.fobPointCode} value={fob.fobPointCode}>
                                    {fob.description}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* SECTION 3: SHIPPER LOCATION LIST */}
            <div className="erp-card" style={{ padding: '12px' }}>
                <h4 className="erp-card-title" style={{ margin: '0 0 10px 0', border: 'none' }}>Shipper Locations List</h4>

                {/* FILTERS */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    alignItems: 'center',
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    marginBottom: '10px'
                }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)' }}>Filters:</span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>Delivery Term</label>
                        <select
                            value={filterDeliveryTerm}
                            onChange={(e) => setFilterDeliveryTerm(e.target.value)}
                            className="erp-select"
                            style={{ width: '130px', height: '24px', padding: '2px 4px', fontSize: '11px' }}
                        >
                            <option value="All">All</option>
                            {deliveryTerms.map(dt => (
                                <option key={dt.deliveryTermCode} value={dt.deliveryTermCode}>
                                    {dt.deliveryTermCode} - {dt.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>Port of Loading</label>
                        <input
                            type="text"
                            value={filterPortOfLoading}
                            onChange={(e) => setFilterPortOfLoading(e.target.value)}
                            className="erp-input"
                            style={{ width: '130px', height: '24px', padding: '2px 4px', fontSize: '11px' }}
                            placeholder="Search Port..."
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>Default</label>
                        <select
                            value={filterDefault}
                            onChange={(e) => setFilterDefault(e.target.value)}
                            className="erp-select"
                            style={{ width: '100px', height: '24px', padding: '2px 4px', fontSize: '11px' }}
                        >
                            <option value="All">All</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>Active</label>
                        <select
                            value={filterActive}
                            onChange={(e) => setFilterActive(e.target.value)}
                            className="erp-select"
                            style={{ width: '100px', height: '24px', padding: '2px 4px', fontSize: '11px' }}
                        >
                            <option value="All">All</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    {(filterDeliveryTerm !== 'All' || filterPortOfLoading !== '' || filterDefault !== 'All' || filterActive !== 'All') && (
                        <button
                            type="button"
                            className="btn-secondary"
                            style={{ height: '24px', fontSize: '11px', padding: '0 8px', display: 'flex', alignItems: 'center' }}
                            onClick={() => {
                                setFilterDeliveryTerm('All');
                                setFilterPortOfLoading('');
                                setFilterDefault('All');
                                setFilterActive('All');
                            }}
                        >
                            Reset Filters
                        </button>
                    )}
                </div>

                {/* Bảng hiển thị danh sách địa điểm */}
                <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                    <table className="data-table" style={{ fontSize: '11.5px' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Location Name</th>
                                <th>Person Title</th>
                                <th>Person Name</th>
                                <th>Position</th>
                                <th>Address Line 1</th>
                                <th>Address Line 2</th>
                                <th>City</th>
                                <th>Province</th>
                                <th>Postal Code</th>
                                <th>Country</th>
                                <th>Phone No</th>
                                <th>Fax</th>
                                <th>Email</th>
                                <th>Term Of Delivery</th>
                                <th>Port Of Loading</th>
                                <th>Default Location</th>
                                <th>Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLocations.length === 0 ? (
                                <tr>
                                    <td colSpan={18} style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>
                                        No locations matching active filters
                                    </td>
                                </tr>
                            ) : (
                                filteredLocations.map((loc, idx) => (
                                    <tr
                                        key={loc.locationID || idx}
                                        onClick={() => handleRowClick(loc)}
                                        onDoubleClick={() => handleRowDoubleClick(loc)}
                                        style={{
                                            cursor: 'pointer',
                                            backgroundColor: locationForm.locationID === loc.locationID ? 'var(--bg-tertiary)' : 'transparent'
                                        }}
                                        title="Click to highlight, Double-click to edit location"
                                    >
                                        <td>{loc.locationID}</td>
                                        <td style={{ fontWeight: 600 }}>{loc.locationName}</td>
                                        <td>{loc.contractPersonTitle}</td>
                                        <td>{loc.contractPersonName}</td>
                                        <td>{loc.contractPersonPosition}</td>
                                        <td>{loc.addressLine1}</td>
                                        <td>{loc.addressLine2}</td>
                                        <td>{loc.city}</td>
                                        <td>{loc.province}</td>
                                        <td>{loc.postalcode}</td>
                                        <td>{loc.countryName || loc.countryID}</td>
                                        <td>{loc.phoneNo}</td>
                                        <td>{loc.fax}</td>
                                        <td>{loc.email}</td>
                                        <td>{loc.termOfDeliveryDesc || loc.termOfDelivery}</td>
                                        <td>{loc.portOfLoading}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <input type="checkbox" checked={!!loc.defaultLocationflag} readOnly style={{ pointerEvents: 'none' }} />
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <input type="checkbox" checked={!!loc.activeflag} readOnly style={{ pointerEvents: 'none' }} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
