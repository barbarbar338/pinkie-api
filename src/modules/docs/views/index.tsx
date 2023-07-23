import React, { FC } from "react";

export interface IIndexPageProps {
	name: string;
}

const MyView: FC<IIndexPageProps> = ({ name }) => <div>Hello {name}</div>;

export default MyView;
