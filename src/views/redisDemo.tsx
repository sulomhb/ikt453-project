import { useEffect, useRef, useState } from "react";

export const RedisCache = ({ data }: { data: any }) => {
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre> {/* Replace with Redis cache data */}
    </div>
  );
};