const notFound = (req: { originalUrl: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: string; path: any; }): void; new(): any; }; }; }) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود',
    path: req.originalUrl
  });
};

export = notFound;