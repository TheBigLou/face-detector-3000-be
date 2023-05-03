const isImage = async (url) => { 
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('Content-Type');
    
        if (contentType && contentType.startsWith('image/')) {
            return true;
        }
    } catch (error) {
        // Ignore errors
    }
    
    return false;
}

const validateImage = async (req, res) => {
    const url = req.body.url;
    const validImage = await isImage(url);

    if (validImage === true) {
        res.status(200).json({ isValid: true });
    } else {
        res.status(200).json({ isValid: false, message: 'Invalid image URL'});
    }
}

module.exports = {
    validateImage: validateImage
}