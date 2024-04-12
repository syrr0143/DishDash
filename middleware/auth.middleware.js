import Jwt from "jsonwebtoken";


export function veriftJwt(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }
    // split method in javascript take input as string and returns the array on the basis of some pattern here pattern iis ' ' so in our case we get the 2 array element 1st onne is bearer and the second one is our toknen and by using this line of code we are accessing the element present in the array at position 1
    const token = authHeader.split(' ')[1]; //  Authorization header format is "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Malformed token' });
    }

    Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        console.log(decoded)
        req.user = decoded;
        next();
    });
}

