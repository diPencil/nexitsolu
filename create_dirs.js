const fs = require('fs');
const path = require('path');

const dirs = [
    'public/services/software/erp',
    'public/services/software/crm',
    'public/services/software/automation',
    'public/services/software/custom',
    'public/services/it-accelerators/automation',
    'public/services/it-accelerators/analytics',
    'public/services/it-accelerators/business_intelligence',
    'public/services/it-accelerators/consulting',
    'public/services/it-accelerators/managed_it',
    'public/services/it-accelerators/cloud_transformation',
    'public/services/hardware/servers',
    'public/services/hardware/networks',
    'public/services/hardware/maintenance',
    'public/services/hardware/cctv',
    'public/services/hardware/field_support',
    'public/services/hardware/workstations',
    'public/services/digital/design',
    'public/services/digital/video',
    'public/services/digital/motion',
    'public/services/digital/marketing',
    'public/services/hosting-vps/buying',
    'public/services/hosting-vps/email',
    'public/services/hosting-vps/migration'
];

dirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created: ${dir}`);
    } else {
        console.log(`Exists: ${dir}`);
    }
});
