import { Controller, Get, Render } from "@nestjs/common";
import { IIndexPageProps } from "src/modules/docs/views";
import { DocsService } from "./service";

@Controller("docs")
export class DocsController {
	constructor(private readonly docsService: DocsService) {}

	@Get()
	@Render("index")
	index(): IIndexPageProps {
		return { name: "world" };
	}
}
