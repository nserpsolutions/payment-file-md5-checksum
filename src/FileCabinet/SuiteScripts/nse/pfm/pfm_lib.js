/**
 * @NApiVersion 2.1
 * @NModuleScope TargetAccount
 * 
 * @Description Library file for FarPay payment processing.
 * @NAmdConfig ./pfm_config.json
 */

define(['N/file', 'N/record', 'N/search', 'CryptoJS', 'SHA256'], (file, record, search, CryptoJS) => {
    const getFileContents = (fileId) => {
        return file.load({
            id: fileId
        }).getContents();
    }

    const sha2Checksum = (data) => {
        return CryptoJS.SHA256(data).toString();
    }

    const findPfmRecord = (pfaId) => {
        let recordId = -1;
        search.create({
            type: 'customrecord_nse_pfm_checksum',
            filters: [
                ['custrecord_nse_pfm_payment_file', 'anyof', [pfaId]]
            ]
        }).run().each(result => {
            recordId = result.id
        });

        return recordId;
    }

    const upsertPfmRecord = (pfaId, fileId) => {
        let pfmRecord;
        let pfmRecordId = findPfmRecord(pfaId);
        if (pfmRecordId === -1) {
            pfmRecord = record.create({
                type: 'customrecord_nse_pfm_checksum'
            });
            pfmRecord.setValue({
                fieldId: 'custrecord_nse_pfm_payment_file',
                value: pfaId
            });
        } else {
            pfmRecord = record.load({
                type: 'customrecord_nse_pfm_checksum',
                id: pfmRecordId
            });
        }

        let checksum = '';
        if (fileId) {
            checksum = sha2Checksum(getFileContents(fileId));
        }

        pfmRecord.setValue({
            fieldId: 'custrecord_nse_pfm_sha256',
            value: checksum
        });

        return pfmRecord.save();
    }

    return {
        upsertPfmRecord
    }
});