export function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    
    return res.status(401).send("Not authenticated.");
  }
}
