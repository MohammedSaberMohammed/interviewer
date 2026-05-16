using AutoMapper;
using Interviewer.Domain.Catalog;

namespace Interviewer.Application.Features.Catalog.GetTechnologies;

public class CatalogMappingProfile : Profile
{
    public CatalogMappingProfile()
    {
        CreateMap<Technology, TechnologyDto>()
            .ConstructUsing(t => new TechnologyDto(
                t.Id,
                t.Title,
                t.Description,
                t.IconUrl,
                t.DisplayOrder,
                t.IsPublished));
    }
}
