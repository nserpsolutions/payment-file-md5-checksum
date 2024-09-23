/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NAmdConfig /SuiteScripts/nse/pfm/pfm_config.json
 */

define(['pfmLib'], (pfmLib) => {
    const afterSubmit = (context) => {
        if (['create', 'edit', 'xedit'].includes(context.type))
            pfmLib.upsertPfmRecord(context.newRecord.id, context.newRecord.getValue({fieldId: 'custrecord_2663_file_ref'}));
    }

    return {
        afterSubmit
    }
});